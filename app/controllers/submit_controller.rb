class SubmitController < ApplicationController
  UID = 45
  PROJECT_ID = 289
  # $user_stor_dir = "#{Rails.root}/data/user"
  
  def index
    id = params[:id]
    gon.push id: id
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, uid.to_s)
    @datasets = @user.datasets
    data = {}
    @datasets.each do |ds|
      ds_name = ds.name
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = ds_name
    end
    gon.push select_box_option: data

  end

  def query
    id = params[:id]
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, @user.id.to_s)
    if @user.task_ids
      @task_list = @user.task_ids.split(',')
    else
      @task_list = []
    end
    gon.push tasks: @task_list
  end

  def query_all # query all tasks by user
    @tasks = Task.where("user_id = ?", session[:user_id])
    parsed_jobs = []
    @tasks.each do |t|
      # submit task
      if t.status == 'running' || t.status = "submitted"
        client = LocalApi::Client.new
        result = client.task_info(UID, t.tid, 'app')
        Rails.logger.debug "===>#{result}"
        if result['status'] == 'success'
          t.status = result['message']['status']
          t.save!
        end
      end
      parsed_jobs.push({
        jobName: t.analysis.name,
        jobId: t.id,
        created: t.created_at,
        status: t.status,
      })
    end
    render json:parsed_jobs
  end

  def query_app_task_dummy
    return_json_hash = {
      "status":"success",
      "message":{
         "status":"finished",
         "inputs":[
            {
               "id":1010,
               "name":"Profiling_table",
               "desc":"",
               "files":[
                  {
                     "name":"LiJ_2014.xls",
                     "path":"/data"
                  }
               ]
            },
            {
               "id":1011,
               "name":"Group_info",
               "desc":"",
               "files":[
                  {
                     "name":"group.tsv",
                     "path":"/data"
                  }
               ]
            }
         ],
         "outputs":[
            {
               "id":854,
               "name":"Cluster_result",
               "desc":"",
               "files":[
                  {
                     "name":"shell",
                     "path":"/project/platform_task_test/task_20210119170627"
                  },
                  {
                     "name":"cluster.result.xls",
                     "path":"/project/platform_task_test/task_20210119170627"
                  },
                  {
                     "name":"coordinate.xls",
                     "path":"/project/platform_task_test/task_20210119170627"
                  },
                  {
                     "name":"group.txt",
                     "path":"/project/platform_task_test/task_20210119170627"
                  }
               ]
            }
         ],
         "params":[
            
         ]
      }
   }
   return_json_hash = {"status":"success", "message":{"status":"finished", "inputs":[{"id":1018, "name":"user_abd", "desc":"abd from metaphlan2", "files":[{      "name":"user_abd.tsv", "path":"/data"}]}, {"id":1044, "name":"group_info", "desc":"group information", "files":[{"name":"anno.tsv", "path":"/data"}]}], "outputs":[{"id":862, "name":"PCOA_result", "desc":"", "files":[{      "name":"shell", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"tmp.csv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"k_PCOA.coordinate.tsv", "path":"/project/platform_task_test/ta      sk_20210207154208"}, {"name":"p_PCOA.coordinate.tsv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"c_PCOA.coordinate.tsv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"o_PCOA.coor      dinate.tsv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"f_PCOA.coordinate.tsv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"g_PCOA.coordinate.tsv", "path":"/project/platform_ta      sk_test/task_20210207154208"}, {"name":"s_PCOA.coordinate.tsv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"t_PCOA.coordinate.tsv", "path":"/project/platform_task_test/task_20210207154208"}, {"name":"group_info.tsv", "path":"/project/platform_task_test/task_20210207154208"}]}], "params":[]}}
    # @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]
    @task = Task.find_by! id:6, user_id:57

    # Rails.logger.debug @task
    result = JSON.parse(return_json_hash.to_json)
    @analysis = @task.analysis
    if @task.status === 'submitted'
      @task.status = result['message']['status']
      @task.save!
    end
    source_files = {}
    response_body = []
    @task_output = {}
    if TaskOutput.where(task_id:@task.id).exists? 
      task_outputs = TaskOutput.where(task_id:@task.id)
      task_outputs.each do |otp|
        @task_output = otp
        parsed_output = processTaskOutput()
        response_body << parsed_output
      end
    else
      result['message']['outputs'].each do |otp|
        @task_output = create_task_output(otp)
        parsed_output = processTaskOutput()
        response_body << parsed_output
      end
    end
    render json: response_body
  end

  def submit_app_task_dummy
    uid = session[:user_id]
    @user = User.find(uid)
    user_dir = File.join($user_stor_dir, uid.to_s)

    result_json = {
      code: false,
      data: ''
    }
    begin
      app_id = params[:app_id]
      app_inputs = params[:inputs]
      app_params = params[:params]
      app_selected = params[:selected]
      @analysis = Analysis.find_by mid:params[:mid]


      
      # submit task
      client = LocalApi::Client.new
      result_hash = {
        message: {
          code: 0,
          data: {
            task_id: 10,
            msg: 'success'
          }
        }
      }
      result = JSON.parse(result_hash.to_json)
      if result['message']['code']
        result_json[:code] = true
        @task  = @user.tasks.new
        @task.analysis = @analysis
        @task.status = 'submitted'
        @task.tid = result['message']['data']['task_id']
        @task.save!
        @user.updated_at = Time.now
        @user.save!
        result_json[:data] = {
          'msg': result['message']['data']['msg'],
          'task_id': @task.id
        }  
      else
        result_json[:code] = false
        result_json[:data] = {
          'msg': result['message']
        }
        
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def submit_app_task
    uid = session[:user_id]
    @user = User.find(uid)
    # user_dir = File.join($user_stor_dir, uid.to_s)
    result_json = {
      code: false,
      data: ''
    }
    begin
      app_id = params[:app_id]
      app_inputs = params[:inputs]
      app_params = params[:params]
      app_selected = params[:selected]
      @analysis = Analysis.find_by mid:params[:mid]

      inputs = Array.new
      params = Array.new

      
      # store selected file to user's data folder
      app_selected&.each do |k, v|
        next unless !v.blank?
        ds_name = v
        @dataset = @user.datasets.find_by(name: v)
        data = @dataset.abd_file()
        # file_path = File.join(user_dir, ds_name, file_name)
        # fix the source of file
        # file = File.open file_path
        
        time = Time.now
        time_str = time.strftime("%Y_%m_%d")       
        time_str += ("_" + time.strftime("%k_%M")) 
        time_str = time_str.gsub(' ','')
        file_name = "#{ds_name}_abd.tsv"
        file = Tempfile.new("#{time_str}_abd.tsv")
        file.write(data)
        uploader = JobInputUploader.new
        uploader.store!(file)
        file.close
        file.unlink
        
        Rails.logger.info("=======>#{uploader}")
        inputs.push({
          k => '/data/' + file_name
        })
      end

      # store input file to user's data folder
      app_inputs&.each do |k, v|
        uploader = JobInputUploader.new
        uploader.store!(v)
	unless v.nil? || v == ""
          inputs.push({
            k => '/data/' + v.original_filename,
          })
	end
      end
      
      app_params&.each do |p|
        p.each do |k, v|
          params.push({
            k => v,
          })
        end
      end
      
      
      # submit task
      client = LocalApi::Client.new
      result = client.run_module(UID, PROJECT_ID, app_id.to_i, inputs, params)
      # Rails.logger.info(result['message'])
      Rails.logger.debug "===========>"
      Rails.logger.info(result)
      if result['message']['code']
        result_json[:code] = true
        @task  = @user.tasks.new
        @task.analysis = @analysis
        @task.status = 'submitted'
        @task.tid = result['message']['data']['task_id']
        @task.save!
        @user.updated_at = Time.now
        @user.save!
        result_json[:data] = {
          'msg': result['message']['data']['msg'],
          'task_id': @task.id
        }  
      else
        result_json[:code] = false
        result_json[:data] = {
          'msg': result['message']
        }
        
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def query_app_task
    result_json = {
      code: false,
      data: ''
    }
    begin
      @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]
      
      # submit task
      client = LocalApi::Client.new
      result = client.task_info(UID, @task.tid, 'app')
      Rails.logger.info(result)
      # result = {"status"=>"success", "message"=>{"status"=>"finished", "inputs"=>[{"id"=>946, "name"=>"MetaPhlan results", "desc"=>"MetaPhlan results", "files"=>[{"name"=>"CRC_Abd_table.txt", "path"=>"/data"}]}], "outputs"=>[{"id"=>779, "name"=>"PCoA analysis", "desc"=>"Bray-Curtis distances among the uploaded sample(s) and the samples in the database will be calculated, and then PCoA analysis will be performed. ", "files"=>[{"name"=>"pcoa.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}, {"id"=>778, "name"=>"Shannon diversity", "desc"=>"The Shannon diversity is calculated for the uploaded sample(s), and be compared with the samples in the databases. ", "files"=>[{"name"=>"Shannon.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}, {"id"=>777, "name"=>"Taxonomical annoatation results", "desc"=>"Top 10 genus and species are selected from the samples, and the taxonomic compositions of the uploaded sample(s).", "files"=>[{"name"=>"histogram.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}, {"id"=>776, "name"=>"Comparison of top 10 genus and species", "desc"=>"The relative abundances of top10 genus and species are compared between the uploaded sample(s) and the data from the database.", "files"=>[{"name"=>"Top10_boxplot.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}], "params"=>[{"id"=>1712, "name"=>"Target region", "prefix"=>"-r", "default"=>"CHN", "desc"=>"Select the samples from the target region in this oral microbiome database, e.g. CHN, JPN, PH or USA.", "value"=>"CHN"}]}}
      if result['status'] == 'success'
        if @task.status == 'submitted'
          @task.status = result['message']['status']
          @task.save!
        end
        response_body = []
        @task_output = {}
        @analysis = @task.analysis
        if TaskOutput.where(task_id:@task.id).exists? 
          task_outputs = TaskOutput.where(task_id:@task.id)
          task_outputs.each do |otp|
            @task_output = otp
            parsed_output = processTaskOutput()
            response_body << parsed_output
          end
        elsif result['message']['status'] == 'finished'
          result['message']['outputs'].each do |otp|
            @task_output = create_task_output(otp)
            parsed_output = processTaskOutput()
            response_body << parsed_output
          end
        end
        render json: response_body
        return
        result_json[:data] = {
          'msg': "the task is #{result['message']['status']}",
        }
      else
        result_json[:data] = result['message']
      end
     
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

    # TODO 写好看点
  def create_task_output(otp)
    task_output = @task.task_outputs.new
    task_output.output_id = otp['id']
    file_paths = {}
    files_to_do = otp['files']
    @analysis.files_info.each do |dataType, info|
      @viz_data_source = VizDataSource.find_by(data_type:dataType)
      if @viz_data_source.allow_multiple
        files_to_do.each do |of1|
          info['outputFileName'].each do |fName|
            if matchPattern(of1['name'], fName)
              file_paths[dataType] = [] if file_paths[dataType].blank?
              file_paths[dataType] << {id: 0, 
                                      url: File.join('/data', of1['path'], of1['name']), 
                                      is_demo: true}
              files_to_do.delete(of1)
            end
          end
          
        end
      else
        files_to_do.each do |of1|
          if of1['name'] == info['outputFileName']
            file_paths[dataType] = {id: 0, 
                                    url: File.join('/data', of1['path'], of1['name']), 
                                    is_demo: true}
            files_to_do.delete(of1)
          end
        end
      end
      
    end
    task_output.file_paths = file_paths
    task_output.save!
    return task_output
  end

  def processTaskOutput
    @analysis_user_datum = AnalysisUserDatum.findOrInitializeBy @analysis.id, session[:user_id]
    @analysis_user_datum.task_output = @task_output
    @analysis_user_datum.use_demo_file = false
    @analysis_user_datum.save!
    parsed_output = {}
    parsed_output['module_name'] = @analysis.visualizer.js_module_name
    parsed_output['name'] = @analysis.name
    parsed_output['analysis_id'] = @analysis.id
    parsed_output['required_data'] = @analysis.files_info.keys
    return parsed_output
  end

  def remove_task
    @task = Task.find params[:job_id]
    @analysis_user_datum = AnalysisUserDatum.find_by task_output: @task.task_outputs[0]
    @analysis_user_datum.task_output = nil
    @analysis_user_datum.use_demo_file = true
    @analysis_user_datum.save!
    @task.destroy!
    render json:{code:true}
  end

  def encode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.encode(id)
  end
  def decode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.decode(id)[0]
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
