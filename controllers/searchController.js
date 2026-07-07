const searchService =
require('../config/services/searchService');

// Search Services
exports.searchServices = async (req, res) => {

    try {

        const keyword = req.query.keyword.trim();

        const services =
        await searchService.searchServices(keyword);

        res.status(200).json({

            success: true,

            count: services.length,

            data: services

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};
//Filter by categorie.
exports.filterByCategory = async (req,res)=>{

    try{

        const { categoryId } = req.params;

        const services =
        await searchService.filterByCategory(categoryId);

        res.status(200).json({

            success:true,

            count:services.length,

            data:services

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};
//Filter by subcategory.
exports.filterBySubcategory = async(req,res)=>{

try{

const {subcategoryId}=req.params;

const services=
await searchService.filterBySubcategory(subcategoryId);

res.status(200).json({

success:true,

count:services.length,

data:services

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
//Filter by Price
exports.filterByPrice = async(req,res)=>{

try{

const {min,max}=req.query;

const services=
await searchService.filterByPrice(min,max);

res.status(200).json({

success:true,

count:services.length,

data:services

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
//Get Active Services.
exports.getActiveServices = async(req,res)=>{

try{

const services=
await searchService.getActiveServices();

res.status(200).json({

success:true,

count:services.length,

data:services

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
