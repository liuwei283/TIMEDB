class AnalysisPipeline < ApplicationRecord
  after_find  :render_fields
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

    private
    def render_fields
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, tables: true, fenced_code_blocks: true)
      # FIXME: should be DRY
      self.rendered_doc = markdown.render(documentation.nil? ? '' : documentation)
    end

end
