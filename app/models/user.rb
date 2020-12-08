class User < ApplicationRecord
    has_many :datasets, dependent: :destroy
end
