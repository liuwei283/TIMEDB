class Task < ApplicationRecord
    belongs_to :user, touch: true
    belongs_to :analysis
    has_many :task_outputs, dependent: :destroy
end
