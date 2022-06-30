class Task < ApplicationRecord
    belongs_to :user, touch: true
    belongs_to :analysis, optional: true
    belongs_to :analysis_pipeline, optional: true
    has_many :task_outputs, dependent: :destroy
    # before_destroy :check_demo?, prepend: true

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

    # def check_demo?
    #     if self.is_demo
    #         throw(:abort)
    #     end
    # end

    def getAppId
        @app_id = ""
        begin
            if !self.analysis.blank?
                @app_id = self.analysis.mid.to_s
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

    def getDeepomicsUrl
        @app_url = ""
        begin
            if !self.analysis.blank?
                @app_url = "project_app_task_monitor?app_id=#{self.analysis.mid}"
            else
                @app_url = "project_pipeline_task_monitor?pipeline_id=#{self.analysis_pipeline.pid}"
            end
        rescue Exception => e
            @app_id = e.message
        end
        # HARD CODE DEEPOMICS PROJECT ID
        return "https://deepomics.org/user/projects/289/#{@app_url}&task_id=#{self.tid}"
    end
end
