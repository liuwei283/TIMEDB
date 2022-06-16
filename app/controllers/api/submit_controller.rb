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
            type = "pipeline" 
            result = if task.analysis_id.blank?
                        client.task_details(UID, task.tid, 'pipeline')
                    else
                        client.task_details(UID, task.tid, 'app')
                    end
            # pipeline task
            if task.analysis_id.blank? and result['status'] == 'success'
                Rails.logger.debug result
                mapped_result = {
                    status: 'success',
                    message: {
                        task_log: '',
                        tasks: [],
                    }
                }
                result['message']['data']['tasks'].each do |app|
                    analysis = Analysis.find_by mid: app['module_id']
                    app_name = if analysis.blank?
                                app['name']
                                else
                                    analysis.name
                                end
                    task_info = {name: app_name, status: app['status'], 
                        module_id: app['module_id'],
                        task_log: app['resource_usage']['task_log'], resource_usage: app['resource_usage']['resource_usage']}
                    mapped_result[:message][:tasks] << task_info
                end
                result = mapped_result
            end
            render json:result
        rescue StandardError => e
            render json:{code:false, errorMessage: e.message}
        end
    end

end
  