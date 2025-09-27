import HomeSection from "./components/HomeSection";
import NavBar from "../Layouts/NavBar";
// import HomeSection from "../../components/sections/HomeSection";

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <NavBar />
      <HomeSection />
    </div>
  );
}

export default HomePage;
