<?php

namespace App\Models;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Events\Registered;

class Account extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, HasFactory;

    protected $primaryKey = 'account_id';

    protected $fillable = [
        'account_name',
        'email',
        'password',
        'role',
        'phone'
    ];

    protected $hidden = [
        'password',
    ];

    #region Getter Setter
    public function getAccountIdAttribute($value)
    {
        return $value;
    }

    public function setAccountIdAttribute($value)
    {
        $this->attributes['account_id'] = $value;
    }

    public function getAccountNameAttribute($value)
    {
        return $value;
    }

    public function setAccountNameAttribute($value)
    {
        $this->attributes['account_name'] = $value;
    }

    public function getEmailAttribute($value)
    {
        return $value;
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = $value;
    }

    public function getPasswordAttribute($value)
    {
        return $value;
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function getRoleAttribute($value)
    {
        return $value;
    }

    public function setRoleAttribute($value)
    {
        $this->attributes['role'] = $value;
    }

    public function getPhoneAttribute($value)
    {
        return $value;
    }

    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = $value;
    }
    #endregion

    #region Relation
    public function customers()
    {
        return $this->hasOne(Customer::class, 'account_id');
    }

    public function agencies()
    {
        return $this->hasOne(Agency::class, 'account_id');
    }
    #endregion
}
