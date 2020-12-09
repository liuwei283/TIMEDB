class AnalysisUserDatum < ApplicationRecord
    belongs_to :analysis
    belongs_to :visitor
end
