const Footer = () => {
  return (
    <div className='mt-12 p-10 text-center text-white bg-gray-800'>
      <div className="flex flex-wrap justify-center">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">About Us</h2>
          <p>Seek & Go is dedicated to providing the best travel experiences to our customers. We believe in exploration,
            adventure, and making memories that last a lifetime.</p>
        </div>
        {/* <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <p>Explore our destinations</p>
          <p>Book your next trip</p>
          <p>Learn about our services</p>
        </div> */}
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p>Seek & Go</p>
          <p>Jakarta Barat, Palmerah</p>
          <p>Email: seekngobjj@gmail.com</p>
        </div>
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold">Connect With Us</h2>
          <p>Follow us on social media:</p>
          <div className="flex justify-center mt-2">
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D">YouTube</a>
            <a href="#"><i className="fab fa-twitter text-lg mx-2"></i></a>
            <a href="#"><i className="fab fa-instagram text-lg mx-2"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
