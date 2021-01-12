class Task < ApplicationRecord
    belongs_to :user
    belongs_to :analysis
    has_many :task_outputs, dependent: :destroy
end
