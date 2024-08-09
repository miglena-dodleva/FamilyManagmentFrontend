import "../../App";

function Home() {
  return (
    <>
     <div style={{ textAlign: 'center' }}> {/* Center text and content */}
      <h1>Welcome to our family management system</h1>
      <img
        className="home"
        src="/images/home_image.webp"
        alt="management"
        loading="lazy"
      />
      </div>
    </>
  );
}

export default Home;
