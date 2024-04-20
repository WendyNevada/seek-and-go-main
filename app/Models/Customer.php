<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $primaryKey = 'customer_id';

    protected $foreignKey = 'account_id';

    protected $fillable = [
        'account_id',
        'customer_name',
        'gender',
        'birth_date'
    ];

    #region Getter Setter
    public function getCustomerIdAttribute($value)
    {
        return $value;
    }

    public function setCustomerIdAttribute($value)
    {
        $this->attributes['customer_id'] = $value;
    }

    public function getAccountIdAttribute($value)
    {
        return $value;
    }

    public function setAccountIdAttribute($value)
    {
        $this->attributes['account_id'] = $value;
    }

    public function getCustomerNameAttribute($value)
    {
        return $value;
    }

    public function setCustomerNameAttribute($value)
    {
        $this->attributes['customer_name'] = $value;
    }

    public function getGenderAttribute($value)
    {
        return $value;
    }

    public function setGenderAttribute($value)
    {
        $this->attributes['gender'] = $value;
    }

    public function getBirthDateAttribute($value)
    {
        return $value;
    }

    public function setBirthDateAttribute($value)
    {
        $this->attributes['birth_date'] = $value;
    }
    #endregion
    
    #region Relations
    public function promoHistories()
    {
        return $this->hasMany(PromoHistory::class);
    }

    public function packageHs()
    {
        return $this->hasMany(PackageH::class);
    }

    public function orderHs()
    {
        return $this->hasMany(OrderH::class);
    }

    public function packageHistoryHs()
    {
        return $this->hasMany(PackageHistoryH::class);
    }
    #endregion
}
