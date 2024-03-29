import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";


interface Props {
    title: string;
    placeHolder: string;
    style: string;
    // eslint-disable-next-line
    field: any;
}
const FormInputItem = (props:Props)=> {
    const {title, placeHolder, field, style} = props

    return (
        <FormItem className={style}>
            <FormLabel>{title}</FormLabel>
            <FormControl>
                <Input placeholder={placeHolder} {...field} onChange={field} />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default FormInputItem;
