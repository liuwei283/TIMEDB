class Analysis < ApplicationRecord
    has_many :viz_source_files
    has_many :analysis_user_data
    belongs_to :analysis_categories
end
