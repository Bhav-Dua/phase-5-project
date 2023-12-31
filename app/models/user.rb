class User < ApplicationRecord
    has_secure_password
    has_many :orders, dependent: :destroy
    has_many :reviews, dependent: :destroy
    has_many :books, through: :orders

    validates :username, presence: true, uniqueness: true
end
