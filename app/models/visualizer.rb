class Visualizer < ApplicationRecord
    has_many :analyses
    has_many :viz_data_sources
end
