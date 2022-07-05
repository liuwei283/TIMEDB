class Admin::TasksController < ApplicationController
  before_action :set_tasks, only: %i[index]
  before_action :set_task, only: %i[show destroy clear_outputs set_demo_task]

  def index
  end

  def new
  end

  def show
    @log = query_app_task_pure
  end

  def set_demo_task
    @task.is_demo = !@task.is_demo
    @task.save!
    flash[:success] = "Task #{@task.is_demo ? "set to demo" : "reset" } successfully."
    redirect_to admin_task_path(@task)
  end

  def clear_outputs
    @task.task_outputs.each do |topt|
      topt.destroy
    end
    result = map_output_task
    if result[:code]
      flash[:success] = result[:data]
    else
      flash[:error] = result[:data]
    end
    redirect_to admin_task_path(@task)
  end

  def destroy
    @task.destroy
    flash[:success] = 'Task deleted.'
    redirect_to admin_tasks_path
  end

  private

  def set_tasks
    @tasks = Task.all
    @task_columns = ["id", "status", "user_id","is_demo", "created_at"]
  end

  def set_task
    @task = Task.find params[:id]
  end

  def query_app_task_pure
    result_json = {
      code: false,
      data: ''
    }
    begin
      # query task
      client = LocalApi::Client.new
      result = ''
      if !@task.analysis.blank?
        result = client.task_info(49, @task.tid, 'app')
      else
        result = client.task_info(49, @task.tid, 'pipeline')
      end
      if !result['message']['status'].blank?
        result_json[:code] = true
        result_json[:data] = result
      else
        result_json[:data] = result
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    return result_json.to_json
  end


  def map_output_task
    result_json = {
      code: false,
      data: ''
    }
    begin
      # query task
      client = LocalApi::Client.new
      result = ''
      if !@task.analysis.blank?
        result = client.task_info(49, @task.tid, 'app')
      else
        result = client.task_info(49, @task.tid, 'pipeline')
      end
      if @task.status == 'submitted'
        @task.status = result['message']['status'] if !result['message']['status'].blank?
        @task.save!
      end
      if result['status'] == 'success'
        response_body = []
        @task_output = {}
        
        if result['message']['status'] == 'finished'
          if result['message']['type'] == "module" # module task
            @analysis = @task.analysis
            @task_output = create_task_output(result['message'])
            parsed_output = processTaskOutput()
            response_body << parsed_output
          else
            @response_body = []
            result['message']['tasks'].each do |mrs|
              @analysis = Analysis.find_by(mid:mrs['module_id'])
              if @analysis.blank?
                @analysis = Analysis.find_by(multiple_mid:mrs['module_id'])
              end
              @task_output = create_task_output(mrs)
              parsed_output = processTaskOutput()
              response_body << parsed_output
            end
          end
        end
        result_json[:code] = true
        result_json[:data] = "output data successfully mapped"
      else
        result_json[:data] = result['message']
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    return result_json
  end


  # TODO 写好看点
  def create_task_output(mrs)
    #   {
    #     "id":671,
    #     "name":"meta_module_double_input_test",
    #     "outputs":[
    #        {
    #           "id":911,
    #           "name":"output",
    #           "desc":"output of double testing",
    #           "files":[
    #              {
    #                 "name":"test_double_output.txt",
    #                 "path":"/project/platform_task_test/gutmeta_pipeline_test1/task_20210517132818/DOAP_meta_module_double_input_test/3P4dmDkcKjCAJANvPLmiwj/output"
    #              }
    #           ]
    #        }
    #     ]
    #  }
    # @task, @analysis
    
    task_output = @task.task_outputs.new
    task_output.analysis = @analysis
    file_paths = {}
    files_to_do = []
    mrs['outputs'].each do |ofile|
      ofile = ofile['files'][0]
      files_to_do.push(ofile)
    end

    # files_to_do = mrs['outputs'][0]['files']
    logger.debug "===========================>Find task output information!"
    logger.info files_to_do
    
    @analysis.files_info.each do |dataType, info|
      @viz_data_source = VizDataSource.find_by(data_type:dataType)
      if @viz_data_source.allow_multiple
        files_to_do.each do |of1|
          info['outputFileName'].each do |fName|
            if matchPattern(of1['name'], fName)
              file_paths[dataType] = [] if file_paths[dataType].blank?
              file_paths[dataType] << {id: 0, 
                                      url: File.join('/data/outputs', of1['path'], of1['name']), 
                                      is_demo: true}
              # files_to_do.delete(of1)
            end
          end
        end
      else
        files_to_do.each do |of1|
          if of1 != nil
            if matchPattern(of1['name'], info['outputFileName'])
              file_paths[dataType] = {id: 0, 
                                      url: File.join('/data/outputs', of1['path'], of1['name']), 
                                      is_demo: true}
              # files_to_do.delete(of1)
            end
          end
        end
      end
    end

    task_output.file_paths = file_paths
    task_output.output_id = 0
    task_output.save!
    return task_output
  end

  def processTaskOutput
    @analysis_user_datum = AnalysisUserDatum.findOrInitializeBy @analysis.id, session[:user_id]
    @analysis_user_datum.task_output = @task_output
    @analysis_user_datum.use_demo_file = false
    @analysis_user_datum.save!
    parsed_output = {}
    parsed_output['module_name'] = @analysis.visualizers[0].js_module_name
    parsed_output['name'] = @analysis.name
    parsed_output['analysis_id'] = @analysis.id
    parsed_output['required_data'] = @analysis.files_info.keys
    return parsed_output
  end
  def matchPattern(name, pattern)
    if pattern.include? "*"
      p = pattern.split "*"
      p.each do |x|
        return false if !name.include? x
      end
      return true
    else 
      return pattern == name
    end
  end
end
