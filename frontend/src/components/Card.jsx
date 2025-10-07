import React from 'react';
import { motion } from 'framer-motion';

function Card({ title, value }) {
  return (
    <motion.div 
      className="bg-white p-6 rounded shadow-md w-64"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

export default Card;
