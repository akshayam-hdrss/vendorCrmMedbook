import axios from "axios";

const BASE_URL = "https://medbook-backend-1.onrender.com/api";

// Image upload to cloudinary
export const uploadImage = (formData) => {
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Hospital Types
export const getHospitalTypes = () => {
  return axios.get(`${BASE_URL}/hospitalType`);
};

export const createHospitalType = (payload) => {
  return axios.post(`${BASE_URL}/hospitalType`, payload);
};

export const updateHospitalType = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/hospitalType/${id}`, data);
};

export const deleteHospitalType = (payload) => {
  return axios.delete(`${BASE_URL}/hospitalType/${payload.id}`);
};

// Hospitals

export const getAllHospitals = () => {
  return axios.get(`${BASE_URL}/hospital`);
};

export const getHospitalsByType = (hospitalTypeId) => {
  return axios.get(`${BASE_URL}/hospital/${hospitalTypeId}`);
};

export const createHospital = (payload) => {
  return axios.post(`${BASE_URL}/hospital`, payload);
};

export const updateHospital = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/hospital/${id}`, data);
};

export const deleteHospital = (id) => {
  return axios.delete(`${BASE_URL}/hospital/${id}`);
};

// hospital information

// ✅ Get hospital info by ID
export const getHospitalInfo = async (hospitalId) => {
  return await axios.get(`${BASE_URL}/hospital-information/hospital/${hospitalId}`);
};

// ✅ Add new hospital info (JSON payload)
export const addHospitalInfo = async (data) => {
  return await axios.post(`${BASE_URL}/hospital-information`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// ✅ Update hospital info (JSON payload)
export const updateHospitalInfo = async (hospitalId, data) => {
  return await axios.put(`${BASE_URL}/hospital-information/hospital/${hospitalId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};


// ✅ Delete hospital info
export const deleteHospitalInfo = async (hospitalId) => {
  return await axios.delete(`${BASE_URL}/hospital-information/hospital/${hospitalId}`);
};

// Traditional Types

export const getTraditionalType = () => {
  return axios.get(`${BASE_URL}/traditionalType`);
};

export const createTraditionalType = (payload) => {
  return axios.post(`${BASE_URL}/traditionalType`, payload);
};

export const updateTraditionalType = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/traditionalType/${id}`, data);
};

export const deleteTraditionalType = (payload) => {
  return axios.delete(`${BASE_URL}/traditionalType/${payload.id}`);
};

// Traditional Hospitals

export const getAllTraditional = () => {
  return axios.get(`${BASE_URL}/traditional`);
};

export const getTraditionalByType = (hospitalTypeId) => {
  return axios.get(`${BASE_URL}/traditional/${hospitalTypeId}`);
};

export const createTraditional = (payload) => {
  return axios.post(`${BASE_URL}/traditional`, payload);
};

export const updateTraditional = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/traditional/${id}`, data);
};

export const deleteTraditional = (id) => {
  return axios.delete(`${BASE_URL}/traditional/${id}`);
};


// GET all doctor types
export const getDoctorTypes = () => {
  return axios.get(`${BASE_URL}/doctorType`);
};

// POST a new doctor type
export const createDoctorType = (payload) => {
  return axios.post(`${BASE_URL}/doctorType`, payload);
};

// PUT (update) a doctor type by ID
export const updateDoctorType = (id, payload) => {
  return axios.put(`${BASE_URL}/doctorType/${id}`, payload);
};

// DELETE a doctor type by ID
export const deleteDoctorType = (id) => {
  return axios.delete(`${BASE_URL}/doctorType/${id}`);
};

export const getDoctors = ({ hospitalId, doctorTypeId }) => {
  const params = {};

  if (doctorTypeId) params.doctorTypeId = doctorTypeId;
  else if (hospitalId) params.hospitalId = hospitalId;
  console.log(params);

  return axios.get(`${BASE_URL}/doctor`, { params });
};

export const getDoctorsByTraditionalId = (hospitalId) => {
  return axios.get(`${BASE_URL}/doctor?traditionalId=${hospitalId}`);
}


// ✅ Get single doctor by ID
export const getDoctorById = (id) => {
  return axios.get(`${BASE_URL}/doctor/${id}`);
};

// ✅ Add new doctor
export const createDoctor = (payload) => {
  return axios.post(`${BASE_URL}/doctor`, payload);
};

// ✅ Update doctor
export const updateDoctor = (id, payload) => {
  return axios.put(`${BASE_URL}/doctor/${id}`, payload);
};

// ✅ Delete doctor
export const deleteDoctor = (id) => {
  return axios.delete(`${BASE_URL}/doctor/${id}`);
};

export const getAllCategories = () =>{return axios.get(`${BASE_URL}/category`);};
export const createCategory = (payload) => {return axios.post(`${BASE_URL}/category`, payload);};
export const updateCategory = (id, payload) =>{return axios.put(`${BASE_URL}/category/${id}`, payload);};
export const deleteCategory = (id) => {return axios.delete(`${BASE_URL}/category/${id}`);};




// ProductsPage0.js 

export const fetchProductTypes = () => axios.get(`${BASE_URL}/products/availableProductType`);


export const addProductType = (data) => axios.post(`${BASE_URL}/products/availableProductType`, data);


export const editProductType = (id, data) => axios.put(`${BASE_URL}/products/availableProductType/${id}`, data);


export const removeProductType = (id) => axios.delete(`${BASE_URL}/products/availableProductType/${id}`);

export const sendImage = (formData) =>
  axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  // ✅ Upload image
export const uploadImagesproductpage1 = (formData) =>
  axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
// ----------------------------------------------------------------------

// --- Product APIs ---
export const getAvailableProducts = (productTypeId) => {
  return axios.get(`${BASE_URL}/products/availableProduct/${productTypeId}`);
};

export const createAvailableProduct = (payload) => {
  return axios.post(`${BASE_URL}/products/availableProduct`, payload);
};

export const updateAvailableProduct = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/products/availableProduct/${id}`, data);
};

export const deleteAvailableProduct = (id) => {
  return axios.delete(`${BASE_URL}/products/availableProduct/${id}`);
};

export const deleteAllAvailableProducts = (productList) => {
  return Promise.all(
    productList.map((item) =>
      axios.delete(`${BASE_URL}/products/availableProduct/${item.id}`)
    )
  );
};


// Product Types
export const getProductTypes = () => {
  return axios.get(`${BASE_URL}/products/productType`);
};

export const createProductType = (payload) => {
  return axios.post(`${BASE_URL}/products/productType`, payload);
};

export const updateProductType = ({ id, ...data }) => {
  return axios.put(`${BASE_URL}/products/productType/${id}`, data);
};

export const deleteProductType = (id) => {
  return axios.delete(`${BASE_URL}/products/productType/${id}`);
};

export const getProductTypesByAvailableProduct = (availableProductId) => {
  return axios.get(`${BASE_URL}/products/productType/byAvailableProduct/${availableProductId}`);
};

// product
export const getProductsByProductType = (productTypeId) => {
  return axios.get(`${BASE_URL}/products/product/byProductType/${productTypeId}`);
};

export const getProductById = (id) => {
  return axios.get(`${BASE_URL}/products/product/${id}`);
};

export const createProduct = (payload) => {
  return axios.post(`${BASE_URL}/products/product`, payload);
};

export const updateProduct = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/products/product/${id}`, data);
};

export const deleteProduct = (id) => {
  return axios.delete(`${BASE_URL}/products/product/${id}`);
};


// Services -1(Available Services)

export const getAvailableServiceTypes=()=>{
  return axios.get(`${BASE_URL}/services/available-service-types`)
}

// POST new service type
export const createAvailableServiceType = (data) => {
  return axios.post(`${BASE_URL}/services/available-service-types`, data);
};

export const updateAvailableServiceType = ({ id, ...data }) => {
  return axios.put(`${BASE_URL}/services/available-service-types/${id}`, data);
};

export const deleteAvailableServiceType = (id) => {
  return axios.delete(`${BASE_URL}/services/available-service-types/${id}`);
};

// Optional image upload API
export const uploadImages = (formData) => {
  return axios.post(`${BASE_URL}/upload`, formData);
};


// Services (Available Services)
export const getAvailableServices = (id) => {
  return axios.get(`${BASE_URL}/services/available-services/${id}`);
};

export const createAvailableService = (payload) => {
  return axios.post(`${BASE_URL}/services/available-services`, payload);
};

export const updateAvailableService = (id, payload) => {
  return axios.put(`${BASE_URL}/services/available-services/${id}`, payload);
};

export const deleteAvailableService = (id) => {
  return axios.delete(`${BASE_URL}/services/available-services/${id}`);
};

// Service Types (related to Available Services)
export const getServiceTypesByAvailableService = (availableServiceId) => {
  return axios.get(`${BASE_URL}/services/service-types/${availableServiceId}`);
};

export const createServiceType = (payload) => {
  return axios.post(`${BASE_URL}/services/service-types`, payload);
};

export const updateServiceType = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/services/service-types/${id}`, data);
};

export const deleteServiceType = (id) => {
  return axios.delete(`${BASE_URL}/services/service-types/${id}`);
};



// ➕ Add Service
export const createService = (payload) => {
  return axios.post(`${BASE_URL}/services/service`, payload);
};

// 📥 Get Service by ID
export const getServiceById = (id) => {
  return axios.get(`${BASE_URL}/services/service/${id}`);
};

// 📋 Get All Services by ServiceTypeId
export const getServicesByType = (serviceTypeId) => {
  return axios.get(`${BASE_URL}/services/services-by-type/${serviceTypeId}`);
};

// ✏️ Update Service
export const updateService = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/services/service/${id}`, data);
};

// ❌ Delete Service
export const deleteService = (id) => {
  return axios.delete(`${BASE_URL}/services/service/${id}`);
};

// blogs api 
export const getBlogs = (id) => {
  return axios.get(`${BASE_URL}/blog/bytopic/${id}`);
}
export const getBlogById = (id) => {
  return axios.get(`${BASE_URL}/blog/${id}`)
}

export const createBlog = (payload) => {
  return axios.post(`${BASE_URL}/blog`, payload)
}

export const deleteBlog = (id) => {
  return axios.delete(`${BASE_URL}/blog/${id}`);
};

export const updateBlog = (id, payload) => {
  return axios.put(`${BASE_URL}/blog/${id}`, payload);
};

//blogs tittle
export const getBlogTopics = () => { return axios.get(`${BASE_URL}/blog/topic`); };
export const createBlogTopic = (data) => axios.post(`${BASE_URL}/blog/topic`, data);
export const updateBlogTopic = (id, data) => axios.put(`${BASE_URL}/blog/topic/${id}`, data);
export const deleteBlogTopic = (id) => axios.delete(`${BASE_URL}/blog/topic/${id}`);

//top Stars
export const topdoctors = () => {
  return axios.get(`${BASE_URL}/doctor/topdoctors`)
};


// 🆕 Ads API

export const getAd = () => {
  return axios.get(`${BASE_URL}/ads/correctGallery/default`);
};

export const createAd = (payload) => {
  return axios.post(`${BASE_URL}/ads/gallery`, payload);
};


export const updateAd = (id, payload) => {
  return axios.put(`${BASE_URL}/ads/gallery/${id}`, payload);
};

export const deleteAd = (id) => {
  return axios.delete(`${BASE_URL}/ads/gallery/${id}`);
};

export const getAds = (category, typeId, itemId) => {
  return axios.get(`${BASE_URL}/ads/correctGallery/${category}?typeId=${typeId}&itemId=${itemId}`);
};

export const getCharities = () => axios.get(`${BASE_URL}/charities`);
export const getCharityById = (id) => axios.get(`${BASE_URL}/charities/${id}`);
export const createCharity = (payload) => axios.post(`${BASE_URL}/charities`, payload);
export const updateCharity = (payload) => {
  const { id, ...data } = payload;
  return axios.put(`${BASE_URL}/charities/${id}`, data);
};
export const deleteCharity = (id) => axios.delete(`${BASE_URL}/charities/${id}`);


// Create new icon
export const createPrimecareIcon = (payload) => {
  return axios.post(`${BASE_URL}/primecareicon`, payload);
};

// Get all icons
export const getPrimecareIcons = () => {
  return axios.get(`${BASE_URL}/primecareicon`);
};

// Update icon by ID
export const updatePrimecareIcon = (id, payload) => {
  return axios.put(`${BASE_URL}/primecareicon/${id}`, payload);
};

// Delete icon by ID
export const deletePrimecareIcon = (id) => {
  return axios.delete(`${BASE_URL}/primecareicon/${id}`);
};


// Event API functions
export const getEvents = () => {
  return axios.get(`${BASE_URL}/event`);
};

export const createEvent = (event) => {
  return axios.post(`${BASE_URL}/event`, event);
};

export const updateEvent = (id, event) => {
  return axios.put(`${BASE_URL}/event/${id}`, event);
};

export const deleteEvent = (id) => {
  return axios.delete(`${BASE_URL}/event/${id}`);
};


// Offers API functions
export const createOffer = (payload) => {
  return axios.post(`${BASE_URL}/offers`, payload);
};

export const getOffers = () => {
  return axios.get(`${BASE_URL}/offers`);
};

export const updateOffer = (id, payload) => {
  return axios.put(`${BASE_URL}/offers/${id}`, payload);
};

export const deleteOffer = (id) => {
  return axios.delete(`${BASE_URL}/offers/${id}`);
};



export const getEmployees = () => {
  return axios.get(`${BASE_URL}/employees`);
};


// quiz game



// ✅ Fetch questions by stage
export const getQuestionsByStage = async (stage) => {
  try {
    const res = await fetch(`${BASE_URL}/quiz?stage=${stage}`);
    const data = await res.json();
    return data.questions || [];
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// ✅ Add a new question
export const addQuestion = async (questionData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error adding question:", error);
  }
};

// ✅ Update a question
export const updateQuestion = async (id, updatedData) => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating question:", error);
  }
};

// ✅ Delete a question
export const deleteQuestion = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/quiz/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("Error deleting question:", error);
  }
};


// userdata 


// ✅ Fetch quiz user data
export const getQuizUserData = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/quiz-userdata`);
    return res.data;
  } catch (err) {
    console.error("Error fetching quiz user data:", err);
    throw err;
  }
};
// ✅ Edit quiz user data
export const editQuizUserData = async (userId, updatedData) => {
  return await axios.put(`${BASE_URL}/quiz-userdata/${userId}`, updatedData);
};

// ✅ Delete quiz user data
export const deleteQuizUserData = async (userId) => {
  return await axios.delete(`${BASE_URL}/quiz-userdata/${userId}`);
};