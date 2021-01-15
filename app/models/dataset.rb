class Dataset < ApplicationRecord
  belongs_to :user, touch: true
end
