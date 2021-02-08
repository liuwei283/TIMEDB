class Dataset < ApplicationRecord
  belongs_to :user, touch: true
  validates :name, presence: true, uniqueness: { 
    message: ->(object, data) do
      "Dataset #{data[:value]} already exists. "
    end
  }, on: :create
end
