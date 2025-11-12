import React, { useEffect, useState } from 'react';
// import { getProductById } from '../api'; // Adjust import path
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getProductById } from '../../../api/api';

function ProductPage4() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(productId)
      .then((res) => {
        if (res.data?.result === 'Success') {
          setProduct(res.data.resultData);
        }
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
      });
  }, [productId]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      {/* Banner */}
      {product.bannerUrl && (
        <div className="mb-4">
          <img
            src={product.bannerUrl}
            alt="Banner"
            className="img-fluid rounded w-100"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Profile Image & Main Info */}
      <div className="text-center mb-4">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="rounded-circle border"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
        <h3 className="mt-3">{product.productName}</h3>
        <p className="mb-1 text-muted">₹{product.price}</p>
        <p className="mb-0 fw-bold">{product.businessName}</p>
        <p className="text-secondary">{product.location}</p>
      </div>

      {/* Other Details */}
      <div className="row mb-4">
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Phone:</strong> {product.phone}</li>
            <li className="list-group-item"><strong>WhatsApp:</strong> {product.whatsapp}</li>
            <li className="list-group-item"><strong>Experience:</strong> {product.experience} years</li>
          </ul>
        </div>
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Address Line 1:</strong> {product.addressLine1}</li>
            <li className="list-group-item"><strong>Address Line 2:</strong> {product.addressLine2}</li>
            {product.mapLink && (
              <li className="list-group-item">
                <strong>Map:</strong>{' '}
                <a href={product.mapLink} target="_blank" rel="noopener noreferrer">
                  View Location
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* About Section */}
      {product.about && (
        <div className="mb-4">
          <h5>About</h5>
          <p className="border p-3 rounded bg-light">{product.about}</p>
        </div>
      )}

      {/* YouTube Video */}
      {product.youtubeLink && (
  <div className="mb-4 text-center">
    <a
      href={product.youtubeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-danger"
    >
      View Video
    </a>
  </div>
)}

      {/* Gallery Carousel */}
      {product.gallery && product.gallery.length > 0 && (
        <div className="mb-5">
          <h5 className="mb-3">Gallery</h5>
          <div id="productGalleryCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product.gallery.map((img, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img
                    src={img}
                    className="d-block w-100 rounded"
                    alt={`Gallery ${index + 1}`}
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            {product.gallery.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#productGalleryCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#productGalleryCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage4;
