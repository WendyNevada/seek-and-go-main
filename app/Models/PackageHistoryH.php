<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageHistoryH extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_code',
        'agency_id',
        'customer_id',
        'package_name',
        'is_custom',
        'promo_code',
        'package_price'
    ];

    protected $primaryKey = 'package_history_h_id';

    #region Getter Setter
    public function getPackageHistoryHIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHistoryHIdAttribute($value)
    {
        $this->attributes['package_history_h_id'] = $value;
    }

    public function getPackageCodeAttribute($value)
    {
        return $value;
    }

    public function setPackageCodeAttribute($value)
    {
        $this->attributes['package_code'] = $value;
    }

    public function getAgencyIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyIdAttribute($value)
    {
        $this->attributes['agency_id'] = $value;
    }

    public function getCustomerIdAttribute($value)
    {
        return $value;
    }

    public function setCustomerIdAttribute($value)
    {
        $this->attributes['customer_id'] = $value;
    }

    public function getPackageNameAttribute($value)
    {
        return $value;
    }

    public function setPackageNameAttribute($value)
    {
        $this->attributes['package_name'] = $value;
    }

    public function getIsCustomAttribute($value)
    {
        return $value;
    }

    public function setIsCustomAttribute($value)
    {
        $this->attributes['is_custom'] = $value;
    }

    public function getPromoCodeAttribute($value)
    {
        return $value;
    }

    public function setPromoCodeAttribute($value)
    {
        $this->attributes['promo_code'] = $value;
    }

    public function getPackagePriceAttribute($value)
    {
        return $value;
    }

    public function setPackagePriceAttribute($value)
    {
        $this->attributes['package_price'] = $value;
    }
    #endregion

    #region Relations
    public function packageHistoryDs()
    {
        return $this->hasMany(PackageHistoryD::class);
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function agency(){
        return $this->belongsTo(Agency::class);
    }
    #endregion
}
