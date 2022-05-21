class Api::SubmitController < ApplicationController
    UID = 49
    PROJECT_ID = 393
    def demo_inputs
        file_sets=[
            {
                value: "demo1",
                label: "Demo filesets 1",
                files: {
                    group_info: "/data/demo/group_info.tsv",
                    user_abd: "/data/demo/user_abd.tsv"
                }
            }
        ]
        render json:file_sets
    end

    def task_details
        client = LocalApi::Client.new
        begin
            task = Task.find params[:id]
            type = "app"
            type = "pipeline" if task.analysis_id.blank?
            result = client.task_details(UID, task.tid, type)
            render json:result
        rescue StandardError => e
            render json:{code:false, errorMessage: e.message}
          end
    end

end
  