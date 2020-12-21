class AnalysisUserDatum < ApplicationRecord
    belongs_to :analysis
    belongs_to :user
    belongs_to :task_output, optional: true
end
