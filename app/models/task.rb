class Task < ApplicationRecord
    belongs_to :user, touch: true
    belongs_to :analysis, optional: true
    belongs_to :analysis_pipeline, optional: true
    has_many :task_outputs, dependent: :destroy

    def getBrief
        return "Task-#{id} (#{self.getAppName}, #{self.status}, user-#{self.user.id})"
    end

    def getAppName
        @app_name = ""
        begin
            if !self.analysis.blank?
                @app_name = self.analysis.name
            else 
                @app_name = self.analysis_pipeline.name
            end
        rescue Exception => e
            @app_name = e.message
        end
        return @app_name
    end

    def getAppId
        @app_id = ""
        begin
            if !self.analysis.blank?
                @app_id = self.analysis.mid.string
            else 
                analysis_ids = self.analysis_pipeline.analyses.map do |a|
                    "#{a.name}: #{a.mid}"
                end
                @app_id = "#{self.analysis_pipeline.pid} (#{analysis_ids.join(", ")})"
            end
        rescue Exception => e
            @app_id = e.message
        end
        
        return @app_id
    end

end
