class AnalysisPipeline < ApplicationRecord
    ANALYSIS_QUERY = -> { select('analyses.*') }
    TASKS_QUERY = -> {select('tasks.*')}
    
    has_many :task_maps
    has_many :tasks, through: :task_maps
    
    has_many :module_requirements
    has_many :analyses, through: :module_requirements
    
    accepts_nested_attributes_for :module_requirements, allow_destroy: true
    accepts_nested_attributes_for :task_maps, allow_destroy: true
  
    validates :name, presence: true
    
end
