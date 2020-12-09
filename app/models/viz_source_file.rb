class VizSourceFile < ApplicationRecord
    has_many :viz_data_objects
    belongs_to :analysis 
end
