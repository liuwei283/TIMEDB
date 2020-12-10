class Analysis < ApplicationRecord
    has_many :viz_file_objects
    has_many :analysis_user_data
    belongs_to :analysis_categories
    belongs_to :visualizer
end
