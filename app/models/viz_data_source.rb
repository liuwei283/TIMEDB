class VizDataSource < ApplicationRecord
    belongs_to :visualizer
    has_many :viz_file_objects
end
