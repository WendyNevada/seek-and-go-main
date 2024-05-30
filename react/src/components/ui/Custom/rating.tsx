import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const rating = (rating: number) => {
    const stars = [];
    //const remainingRating = rating;
    const maxRating = 5;
    const threshold = 0.5;

    const a = rating * 10;
    const b = Math.floor(a/10);
    const c = a % 10;
    const d = maxRating - b - 1;

    for (let i = 0; i <b; i++) {
        stars.push(<StarOutlinedIcon className="text-yellow-500" />);
        // remainingRating -= 1;
    }

    if ((threshold * 10) < c) {
        stars.push(<StarHalfOutlinedIcon className="text-yellow-500" />);
    }

    else{
        stars.push(<StarBorderIcon className="text-yellow-500" />);
    }

    for (let i = 0; i <d; i++) {
        stars.push(<StarBorderIcon className="text-yellow-500" />);
    }
    return stars;
};

export default rating;
