export default class AttractionObj{
    agency_id:number;
    attraction_code:string;
    area_1:string;
    area_2:string;
    area_3:string;
    area_4:string;
    attraction_name:string;
    description:string;
    address:string;
    rating:number;
    is_active:boolean;
    qty:number;
    promo_code:string;
    base_price:number;
    promo_code_affiliate:string;
    picture:File|null;


    constructor(){
        this.agency_id = 0
        this.attraction_code = ""
        this.area_1 = ""
        this.area_2 = ""
        this.area_3 = ""
        this.area_4 = ""
        this.attraction_name = ""
        this.description = ""
        this.address = ""
        this.rating = 0
        this.is_active = true
        this.qty = 0
        this.promo_code = ""
        this.base_price = 0
        this.promo_code_affiliate = ""
        this.picture = null
    }
}
