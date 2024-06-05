import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import axiosClient from "@/axios.client";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
//import HashLoader from "react-spinners/HashLoader";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: RatingData[];
  order_h_id: number;
  onSave: () => void;
}

interface RatingData {
    id: number;
    product_type: string;
}

const RatingDialog = ({ isOpen, onClose, products, order_h_id, onSave }: RatingDialogProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
//   const [loading, setLoading] = useState(false);

  interface StarProps {
    filled: boolean;
    onClick: () => void;
  }
  
  const Star = ({ filled, onClick }: StarProps) => (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`h-6 w-6 cursor-pointer ${filled ? "text-yellow-500" : "text-gray-300"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.054 6.353a1 1 0 00.95.69h6.601c.969 0 1.371 1.24.588 1.81l-5.347 3.883a1 1 0 00-.364 1.118l2.054 6.354c.3.92-.755 1.688-1.54 1.118l-5.347-3.883a1 1 0 00-1.175 0l-5.347 3.883c-.784.57-1.84-.198-1.54-1.118l2.054-6.354a1 1 0 00-.364-1.118L2.856 11.78c-.783-.57-.38-1.81.588-1.81h6.601a1 1 0 00.95-.69l2.054-6.353z"
      />
    </svg>
  );

  const handleRatingClick = (rate: number) => {
    setRating(rate);
  };

  const onSubmit = async () => 
    {
        try
        {
            // setLoading(true);

            const response = await axiosClient.post('v1/RateProduct', {
                id : products[0].id,
                product_type : products[0].product_type,
                rating : rating,
                order_h_id : order_h_id
            });

            // setLoading(false);

            if(response.status === 200) {
                toast({
                    variant: "success",
                    description: response.data.message
                });
            }
            else
            {
                toast({
                    variant: "destructive",
                    description: response.data.message
                });
            }
            onSave();
            onClose();
        }
        catch (response) {
            const axiosError = response as AxiosError;
            if (axios.isAxiosError(response)) {
                toast({
                    variant: "destructive",
                    description: (axiosError.response?.data as { message: string })?.message,
                });
            }
        }
    }

  return (
    <>
        {/* {loading ? (
            <div className="flex justify-center items-center min-h-screen">
            <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        ) : (
        <> */}
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>{t("Rating")}</DialogTitle>
            <DialogDescription>
                {t("Please rate your experience on this product")}
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                <Star
                    key={index}
                    filled={index < rating}
                    onClick={() => handleRatingClick(index + 1)}
                />
                ))}
            </div>
            </div>
            <DialogFooter>
            <Button
                onClick={onSubmit}
                className="bg-green-500 hover:bg-green-700"
                type="submit"
            >
                {t("Confirm")}
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
        {/* </>
        )} */}
    </>
  );
};

export default RatingDialog;
