class User < ApplicationRecord
    has_many :datasets, dependent: :destroy
    has_many :analysis_user_data, dependent: :destroy
    has_many :viz_file_objects, dependent: :destroy
    has_many :task_outputs, dependent: :destroy
end
