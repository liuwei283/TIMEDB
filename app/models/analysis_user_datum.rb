class AnalysisUserDatum < ApplicationRecord
    belongs_to :analysis
    belongs_to :user
    belongs_to :task_output, optional: true

    def self.createDefaultDatum (analysis_id, user_id, task_output_id=nil)
        @analysis = Analysis.find(analysis_id)
        @analysisUserDatum = @analysis.analysis_user_data.new
        default_chosen = {}.tap { |x|
            @analysis.files_info.each do |dataType, info|
                next unless !VizDataSource.find_by(data_type:dataType).optional
                x[dataType] = nil
            end
        } 
        @analysisUserDatum.chosen =  default_chosen
        @analysisUserDatum.user = User.find(user_id)
        if !task_output_id.blank?
            @task_output = TaskOutput.find(task_output_id)
            @analysis_user_datum.task_output = @task_output
        end
        @analysisUserDatum.save!
        return @analysis_user_datum
    end
end
