
import Product from '../models/product.model.js'

async function createProduct(req, res) {
   try {
      const {
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         material,
         gender,
         images,
         isFeatured,
         isPublished,
         tags,
         dimensions,
         weight,
         sku
      } = req.body

      const product = new Product(
         {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id
         }
      )
      const createdProduct = await product.save()
      return res.status(201).json(createdProduct)
   } catch (error) {
      console.error(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

async function updateProductById(req, res) {
   try {
      const {
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         material,
         gender,
         images,
         isFeatured,
         isPublished,
         tags,
         dimensions,
         weight,
         sku
      } = req.body

      //Find product by id
      const product = await Product.findById(req.params.id)
      if (!product) {
         return res.status(404).json({ msg: "Product not found" })
      }

      //Update product
      product.name = name || product.name
      product.description = description || product.description
      product.price = price || product.price
      product.discountPrice = discountPrice || product.discountPrice
      product.countInStock = countInStock || product.countInStock
      product.category = category || product.category
      product.brand = brand || product.brand
      product.sizes = sizes || product.sizes
      product.colors = colors || product.colors
      product.collections = collections || product.collections
      product.material = material || product.material
      product.gender = gender || product.gender
      product.images = images || product.images

      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured
      product.isPublished = isPublished !== undefined ? isPublished : product.isPublished
      product.tags = tags || product.tags
      product.dimensions = dimensions || product.dimensions
      product.weight = weight || product.weight
      product.sku = sku || product.sku

      const updatedProduct = await product.save()
      return res.status(200).json({ msg: "Update product successfully", updatedProduct })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

async function deleteProductById(req, res) {
   try {
      const product = await Product.findById(req.params.id)
      if (!product) {
         return res.status(404).json({ msg: "Product not found" })
      }
      await product.deleteOne()
      return res.status(200).json({ msg: "Product deleted successfully" })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

// Get ALl products with optional query filters
async function getAllProducts(req, res) {
   try {
      const {
         collection,
         size,
         color,
         gender,
         minPrice,
         maxPrice,
         sortBy,
         search,
         category,
         material,
         brand,
         limit
      } = req.query

      let query = {};

      //Filter logic
      if (collection && collection.toLocaleLowerCase() !== "all") {
         query.collections = collection;
      }
      if (category && category.toLocaleLowerCase() !== "all") {
         query.category = category;
      }
      if (material) {
         query.material = { $in: material.split(",") }
      }
      if (brand) {
         query.brand = { $in: brand.split(",") }
      }
      if (size) {
         query.sizes = { $in: size.split(",") }
      }
      if (color) {
         query.colors = { $in: [color] }
      }
      if (gender) {
         query.gender = gender
      }
      if (minPrice || maxPrice) {
         query.price = {}
         if (minPrice) query.price.$gte = Number(minPrice)
         if (maxPrice) query.price.$lte = Number(maxPrice)
      }
      if (search) {
         query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
         ]
      }

      //Sorting logic
      let sort = {};
      if (sortBy) {
         switch (sortBy) {
            case "priceAsc":
               sort = { price: 1 }
               break;
            case "priceDesc":
               sort = { price: -1 }
               break;
            case "popularity":
               sort = { rating: -1 }
               break;
            default:
               sort = { createdAt: -1 }
               break;
         }
      }

      //Fetch products and apply sorting and limit
      let products = await Product.find(query).sort(sort).limit(Number(limit) || 0)
      return res.json(products)
   }
   catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

async function getSingleProduct(req, res) {
   try {
      const product = await Product.findById(req.params.id)
      if (!product) {
         return res.status(404).json({ msg: "Product not found" })
      }
      return res.status(200).json( product )
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

//is ka maqsad ha jin product ki category and gender same lkn un ki id different ha wo same category and gender wala srf 4 products hi user ko dikhao even 100 products hi q na hon
async function similarProduct(req, res) {
   try {
      const { id } = req.params;

      const product = await Product.findById(id)
      if (!product) {
         return res.status(404).json({ msg: "Product not found" })
      }

      const similarProducts = await Product.find({
         _id: { $ne: id },
         gender: product.gender,
         category: product.category,
      }).limit(4)

      return res.status(200).json(similarProducts )
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

async function getHighestRatedProducts(req, res) {
   try {
      const bestSellingProducts = await Product.findOne().sort({ rating: -1 })
      if (!bestSellingProducts) {
         return res.status(404).json({ msg: "No best selling products found" })
      }
      return res.status(200).json( bestSellingProducts)
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

async function getNewArrivals(req, res){
   try {
      // Fetch latest 8 products
      const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8)
      if (!newArrivals) {
         return res.status(404).json({ msg: "No new arrivals found" })
      }
      return res.status(200).json({ msg: "Get new arrivals successfully", newArrivals })
   } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: "Server error" })
   }
}

export { createProduct, updateProductById, deleteProductById, getAllProducts, getSingleProduct, similarProduct, getHighestRatedProducts, getNewArrivals}