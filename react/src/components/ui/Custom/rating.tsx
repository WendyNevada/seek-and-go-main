import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const rating = (rating: number) => {
    const stars = [];
    const maxRating = 5;
    const threshold = 0.5;

    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 >= threshold; // Check if there's a half star

    for (let i = 0; i < fullStars; i++) {
        stars.push(<StarOutlinedIcon className="text-yellow-500" />);
    }

    if (hasHalfStar) {
        stars.push(<StarHalfOutlinedIcon className="text-yellow-500" />);
    }

    const remainingStars = maxRating - stars.length; // Calculate remaining empty stars
    for (let i = 0; i < remainingStars; i++) {
        stars.push(<StarBorderIcon className="text-yellow-500" />);
    }

    return stars;
};

export default rating;
