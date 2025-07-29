import Cart from '../models/cart.model.js'
import Product from '../models/product.model.js'

// Helper function to get a cart by userId or guestId
async function getCart(userId, guestId) {
   if (userId) {
      return await Cart.findOne({ user: userId });
   } else if (guestId) {
      return await Cart.findOne({ guestId });
   }

   return null
}
async function addToCart(req, res) {
   const { productId, quantity, size, color, guestId, userId } = req.body
   
   try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ msg: "Product not found" });

      let cart = await getCart(userId, guestId);
      if (cart) {
         const productIndex = cart.products.findIndex(
            (p) =>
               p.productId.toString() === productId &&
               p.size === size &&
               p.color === color
         );

         if (productIndex > -1) {
            // If product already exists, update quantity
            cart.products[productIndex].quantity += quantity;
         } else {
            // Add new product
            cart.products.push({
               productId,
               name: product.name,
               image: product.images[0]?.url || '',
               price: product.price,
               size,
               color,
               quantity,
            });
         }

         // Calculate total price
         cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
         
         // Use findOneAndUpdate with version key to prevent race conditions
         const updatedCart = await Cart.findOneAndUpdate(
            { 
               _id: cart._id,
               __v: cart.__v // Optimistic concurrency control
            },
            { 
               products: cart.products,
               totalPrice: cart.totalPrice,
               $inc: { __v: 1 }
            },
            { new: true }
         );

         if (!updatedCart) {
            return res.status(409).json({ msg: "Cart was modified by another request, please try again" });
         }

         return res.status(200).json({ msg: "Product added to cart", cart: updatedCart });
      } else {
         // Create a new cart
         const newCart = await Cart.create({
            user: userId ? userId : undefined,
            guestId: guestId ? guestId : "guest_" + new Date().getTime(),
            products: [
               {
                  productId,
                  name: product.name,
                  image: product.images[0]?.url || '',
                  price: product.price,
                  size,
                  color,
                  quantity
               }
            ],
            totalPrice: product.price * quantity
         });
         return res.status(200).json({ msg: "Product added to cart", cart: newCart });
      }

   } catch (error) {
      console.log(error);
      if (error.code === 11000) {
         return res.status(409).json({ msg: "Duplicate cart operation, please try again" });
      }
      res.status(500).json({ msg: "Server error" });
   }
}

// Update cart quantity for logged-in users or guests
async function updateCartQuantity(req, res) {
   const { productId, quantity, size, color, guestId, userId } = req.body;

   try {
      let cart = await getCart(userId, guestId);
      if (!cart) return res.status(404).json({ msg: "Cart not found" });
      const productIndex = cart.products.findIndex(
         (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
      );

      if (productIndex > -1) {
         if (quantity > 0) {
            cart.products[productIndex].quantity = quantity;
         } else {
            cart.products.splice(productIndex, 1); //Remove product if quantity is 0
         }

         cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
         await cart.save();

         return res.status(200).json({ msg: "Cart updated successfully", cart });
      } else {
         return res.status(404).json({ msg: "Product not found in cart" });
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
   }
}

async function deleteFromCart(req, res) {
   const { productId, size, color, guestId, userId } = req.body;
   try {
      let cart = await getCart(userId, guestId)
      if (!cart) return res.status(404).json({ msg: "Cart not found" });

      const productIndex = cart.products.findIndex(
         (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
      );
      if (productIndex > -1) {
         cart.products.splice(productIndex, 1);
         cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
         await cart.save();
         return res.status(200).json(cart);
      } else {
         return res.status(404).json({ msg: "Product not found in cart" });
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
   }
}

// Get logged-user's or guest user's cart
async function getCartDetails(req, res) {
   const { userId, guestId } = req.query;

   try {
      const cart = await getCart(userId, guestId);
      if (!cart) return res.status(404).json({ msg: "Cart not found" });

      return res.status(200).json({ ms: "Cart details fetched successfully", cart });
   } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
   }
}

// Merge guest cart into user cart on login
async function mergeCarts(req, res) {
   const { guestId } = req.body;
   try {
      // Find the guest cart and logged-in user cart
      const guestCart = await Cart.findOne({ guestId });
      const userCart = await Cart.findOne({ user: req.user._id });

      if (guestCart && guestCart.products.length > 0) {
         if (userCart) {
            // Merge guest cart products into user cart
            guestCart.products.forEach((guestItem) => {
               const productIndex = userCart.products.findIndex(
                  (p) => p.productId.toString() === guestItem.productId.toString() &&
                     p.size === guestItem.size &&
                     p.color === guestItem.color
               );
               if (productIndex > -1) {
                  // If product already exists, update quantity
                  userCart.products[productIndex].quantity += guestItem.quantity;
               } else {
                  // Add new product
                  userCart.products.push(guestItem);
               }
            });

            userCart.totalPrice = userCart.products.reduce(
               (acc, item) => acc + item.price * item.quantity, 0
            );
            await userCart.save();

            // Delete the guest cart after merging
            await Cart.findOneAndDelete({ guestId });
            
            return res.status(200).json({ 
               msg: "Guest cart merged into user cart", 
               cart: userCart 
            });
         } else {
            // If the user has no existing cart, convert guest cart to user cart
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
            
            return res.status(200).json({ 
               msg: "Guest cart converted to user cart", 
               cart: guestCart 
            });
         }
      } else {
         // No guest cart or empty guest cart
         if (userCart) {
            return res.status(200).json({ 
               msg: "No guest cart to merge, returning user cart", 
               cart: userCart 
            });
         } else {
            // Create empty cart for user
            const newUserCart = await Cart.create({
               user: req.user._id,
               products: [],
               totalPrice: 0
            });
            
            return res.status(200).json({ 
               msg: "No carts found, created new user cart", 
               cart: newUserCart 
            });
         }
      }

   } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error" });
   }
}

export { addToCart, updateCartQuantity, deleteFromCart, getCartDetails, mergeCarts };