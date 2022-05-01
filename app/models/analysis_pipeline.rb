class AnalysisPipeline < ApplicationRecord
    ANALYSIS_QUERY = -> { select('analyses.*') }
    
    has_many :tasks
    
    has_many :module_requirements
    has_many :analyses, ANALYSIS_QUERY, through: :module_requirements
    
    accepts_nested_attributes_for :module_requirements, allow_destroy: true
  
    validates :name, presence: true
    def can_be_destroyed
        if self.tasks.blank?
          return true
        else
          return false
        end
    end
end
