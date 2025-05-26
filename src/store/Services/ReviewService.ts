import axios from 'axios';

export interface Review {
  id: number;
  name: string;
  company: string;
  rating: number;
  content: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createReview = async (review: Omit<Review, 'id'>): Promise<Review> => {
  try {
    const response = await axios.post(`${API_URL}/reviews`, review, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await axios.get(`${API_URL}/reviews`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}; 