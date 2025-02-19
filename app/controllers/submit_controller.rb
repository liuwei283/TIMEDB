class SubmitController < ApplicationController
  skip_before_action :validate_cookie, only: [:tcrAnalyses, :tcrclub]
  UID = 49
  PROJECT_ID = 393
  # $user_stor_dir = "#{Rails.root}/data/user"
  def analyses
    input_aname = params[:aname]
    if input_aname
      if Analysis.find_by(name:input_aname)
        category1 = Analysis.find_by(name:input_aname).analysis_category.name
        ana1 = Analysis.find_by(name:input_aname).name
        @analysis_categories = AnalysisCategory.order(:name)
        redirect_to action: "analysesCategory", cname: category1, aname: ana1
      else
        redirect_to action: "analysesCategory", cname: input_aname
      end
    else
      category1 = "Regression Tools"
      @analysis_categories = AnalysisCategory.order(:name)
      redirect_to action: "analysesCategory", cname: category1
    end
  end

  def tcrAnalyses

    ### require cookie
    unless session[:user_id]
        @user = User.new
        @user.dataset_n = 0
        @user.save
        session[:user_id] = @user.id
    end
    # check user
    id = session[:user_id]
    if User.exists? id
        @user = User.find(id)
        @user.touch

    else 
        # already expired
        @user = User.new
        @user.dataset_n = 0
        @user.save
        session[:user_id] = @user.id
    end
    ################################################################

    @tcr_category = AnalysisCategory.find_by(name:"wTCRanno")


    gon.push cname: "wTCRanno"
    gon.push dark: session[:dark]
    
    @analyses = @tcr_category.analyses.all

    # uid = session[:user_id]
    # @user = User.find(uid)
    # @datasets = @user.datasets
    @datasets = Project.all.order(:project_name)
    data = {}
    @datasets.each do |ds|
      ds_name = ds.project_name
      # ps_num = ds.getProjectSources(ds_name).length
      platform_name = ds.platform
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = platform_name
    end

    gon.push select_box_option: data

  end

  def tcrclub

    ### require cookies
    unless session[:user_id] # new users
      @user = User.new
      @user.dataset_n = 0
      @user.save
      session[:user_id] = @user.id
    end
    # check whether user has expired
    user_id = session[:user_id]
    if User.exists? user_id
      @user = User.find(user_id)
      @user.touch
    else
      @user = User.new
      @user.dataset_n = 0
      @user.save
      session[:user_id] = @user.id
    end

    ################################################################
    @tcrclub_cat = AnalysisCategory.find_by(name:"TCRclub")

    gon.push cname: "TCRclub"
    gon.push dark: session[:dark]
    
    @analyses = @tcrclub_cat.analyses.all

    # uid = session[:user_id]
    # @user = User.find(uid)
    # @datasets = @user.datasets
    @datasets = Project.all.order(:project_name)
    data = {}
    @datasets.each do |ds|
      ds_name = ds.project_name
      # ps_num = ds.getProjectSources(ds_name).length
      platform_name = ds.platform
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = platform_name
    end

    gon.push select_box_option: data

  end


  def analysesCategory

    @analysis_categories = AnalysisCategory.order(:name)
    @analysis_category = AnalysisCategory.find_by name:params[:cname]

    gon.push cname: params[:cname]
    gon.push dark: session[:dark]

    # Rails.logger.error (params[:cname])
    
    @analyses = @analysis_category.analyses.all

    # uid = session[:user_id]
    # @user = User.find(uid)
    # @datasets = @user.datasets
    @datasets = Project.all.order(:project_name)
    data = {}
    @datasets.each do |ds|
      ds_name = ds.project_name
      # ps_num = ds.getProjectSources(ds_name).length
      platform_name = ds.platform
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = platform_name
    end

    if params[:aname]
      gon.push input_aname: params[:aname]
    end

    if params[:ds_selected]
      gon.push ds_selected: params[:ds_selected]
    end

    gon.push select_box_option: data
  end

  def pipelines
    type = params[:ptype]
    if type == "all"
      @all_pipelines = AnalysisPipeline.where("name LIKE '%All%'").all
      @pipelines = @all_pipelines
    else
      @consensus_pipelines = AnalysisPipeline.where("name LIKE '%Consensus%'").all
      @pipelines = @consensus_pipelines
    end
    @analysis_categories = AnalysisCategory.order(:name) #no sense, just for sidebar

    @datasets = Project.all.order(:project_name)
    data = {}
    @datasets.each do |ds|
      ds_name = ds.project_name
      # ps_num = ds.getProjectSources(ds_name).length
      platform_name = ds.platform
      # ds_dir = File.join(user_dir, ds_name)
      # file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = platform_name
    end

    # uid = session[:user_id]
    # @user = User.find(uid)
    # # user_dir = File.join($user_stor_dir, uid.to_s)
    # @datasets = @user.datasets
    # data = {}
    # @datasets.each do |ds|
    #   ds_name = ds.name
    #   ps_num = ds.getProjectSources(ds_name).length
    #   platform_names, project_names = ds.getProjectsPlatforms(ds_name)
    #   # ds_dir = File.join(user_dir, ds_name)
    #   # file_list = Dir.entries(ds_dir)[2..-1]
    #   data[ds_name] = [ps_num, platform_names, project_names] 
    # end
    gon.push select_box_option: data
    gon.push ptype: type

  end



  def query_app_task_test
    @result_json = {
      code: false,
      data: ''
    }
    @result_message = []
    
    begin
      client = LocalApi::Client.new
      @result_message << client.task_info(UID, 243, 'pipeline')
      @result_message << client.task_info(UID, 252, 'pipeline')
      @result_message << client.task_info(UID, 253, 'pipeline')
    rescue StandardError => e
      @result_json[:code] = false
      @result_json[:data] = e.message
    end
  end

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
    @analyses = Analysis.all
    @pipelines = AnalysisPipeline.all
    uid = session[:user_id]
    @user = User.find(uid)
    @dataset_list = @user.datasets

    # user_dir = File.join($user_stor_dir, @user.id.to_s)
    if @user.task_ids
      @task_list = @user.task_ids.split(',')
    else
      @task_list = []
    end
    gon.push tasks: @task_list

    @tasks = @user.tasks
  end

  def query_demo
    demo_result_id = params[:demo_id]
    @jobName = params[:jobName]
    @task = Task.find(demo_result_id)
    gon.push run_id: @task.run_id
    
    if @task.analysis
      gon.push search_id: @task.analysis.mid
      gon.push category: @task.analysis.analysis_category.name
    else
      gon.push search_id: @task.analysis_pipeline.pid
      gon.push category: ""
    end
    gon.push demo_result_id: demo_result_id
    gon.push job_name: @jobName
    gon.push isDemoJobPage: true
  end

  def pipeline
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

  def query_demo_tasks # query all demo tasks
    @tasks = Task.where("is_demo")
    parsed_jobs = []
    result = nil
    @tasks.each do |t|
      if !t.analysis.blank?
        jobName = t.analysis.name
      else
        jobName = t.analysis_pipeline.name
      end
      parsed_jobs.push({
        taskName: jobName,
        taskId: t.id,
        created: t.created_at,
        status: t.status,
      })
    end
    render json:parsed_jobs
  end

  def query_all # query all tasks by user
    @tasks = Task.where("user_id = ?", session[:user_id]).order(:id).reverse_order
    parsed_jobs = []
    result = nil
    @tasks.each do |t|
      # submit task
      if t.status == 'running' || t.status == "submitted"
        client = LocalApi::Client.new
        if !t.analysis.blank?
          result = client.task_info(UID, t.tid, 'app')
        else
          result = client.task_info(UID, t.tid, 'pipeline')
        end
        Rails.logger.debug "=====>"
        Rails.logger.debug([result['status'], result['message']['status']])
        Rails.logger.debug result
        if result['status'] == 'success'
          t.status = result['message']['status'] if !result['message']['status'].blank?
          t.save!
        end
      end
      if !t.analysis.blank?
        jobName = t.analysis.name
        category = t.analysis.analysis_category.name
        analysis_id = t.analysis.mid
      else
        jobName = t.analysis_pipeline.name
        category = "pipeline"
        analysis_id = t.analysis_pipeline.pid
      end
      parsed_jobs.push({
        taskName: jobName,
        category: category,
        taskId: t.id,
        run_id: t.run_id,
        created: t.created_at,
        status: t.status,
        isDemo: t.is_demo,
        analysis_id: analysis_id
      })
    end
    render json:parsed_jobs
  end

  def query_app_task_dummy
    @task = nil
    Rails.logger.debug params[:is_demo]
    if params[:is_demo]
      @task = Task.find_by! id:params[:job_id], is_demo: true
    else 
      @task =Task.find_by! id:params[:job_id], user_id:session[:user_id]
    end
    return_json_hash = {"status":"success","message":{"status":"finished","type":"pipeline","inputs":[],"outputs":[],"params":[],"tasks":[{"status":"finished","module_id":678,"name":"meta_testing","outputs":[{"id":919,"name":"testing","desc":"Wilcox testing results with p adjusted","files":[{"name":"s_ttest.tsv","path":"diff_test"}]},{"id":918,"name":"species_pass","desc":"","files":[{"name":"D065626_Healthy.s.pass.abd.xls","path":"diff_test"}]}]},{"status":"finished","module_id":677,"name":"meta_classifier","outputs":[{"id":917,"name":"classifier","desc":"","files":[{"name":"D065626_Healthy.s.Train_Sample_profile.xls","path":"classifier"},{"name":"D065626_Healthy.s.Train_Sample_group.info","path":"classifier"},{"name":"D065626_Healthy.s.RF.R","path":"classifier"},{"name":"D065626_Healthy.s.cross_validation_error.txt","path":"classifier"},{"name":"D065626_Healthy.s.cross_validation_pick.txt","path":"classifier"},{"name":"D065626_Healthy.s.feature.importance.xls","path":"classifier"},{"name":"D065626_Healthy.s.cross_validation.marker.predict.in.train.txt","path":"classifier"},{"name":"D065626_Healthy.s.train_ci_result.txt","path":"classifier"},{"name":"D065626_Healthy.s.train.auc_info.txt","path":"classifier"}]}]}],"error_message":""}}
    # {"status":"success", "message":{"status":"", "type":"pipeline", "inputs":[], "outputs":[], "params":[], "tasks":[{"status":"finished", "module_id":645, "name":"gutmeta_beta_diversity", "outputs":[{"id":878, "name":"beta_diversity", "desc":"beta diversity", "files":[{"name":"k_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"k_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"k_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"p_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"p_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"p_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"c_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"c_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"c_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"o_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"o_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"o_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"f_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"f_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"f_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"g_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"g_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"g_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"s_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"s_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"s_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"t_test_result.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"t_compare_group.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"t_Beta_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}, {"name":"group_info.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_beta_diversity/R2DqFYJzP6ueKdJxWgE37P/output"}]}]}, {"status":"finished", "module_id":666, "name":"meta_alpha_diversity", "outputs":[{"id":908, "name":"alpha_diversity", "desc":"alpha diversity", "files":[{"name":"Alpha_diversity_pvalue.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_alpha_diversity/bUT8BVcs4vWonCY7DWKofd/output"}, {"name":"Alpha_diversity.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_alpha_diversity/bUT8BVcs4vWonCY7DWKofd/output"}, {"name":"group_info.tsv", "path":"/project/gutmeta_pipeline_test1/task_20210713125024/DOAP_gutmeta_alpha_diversity/bUT8BVcs4vWonCY7DWKofd/output"}]}]}], "error_message":""}}
   
    # @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]
    @task = Task.find_by! id:params[:job_id], user_id:session[:user_id]

    # Rails.logger.debug @task
    result = JSON.parse(return_json_hash.to_json)

    if @task.status === 'submitted'
      @task.status = result['message']['status'] if !result['message']['status'].blank?
      @task.save!
    end

    response_body = []

    if TaskOutput.where(task_id:@task.id).exists? 
      task_outputs = TaskOutput.where(task_id:@task.id)
      task_outputs.each do |otp|
        @task_output = otp
        @analysis = otp.analysis
        parsed_output = processTaskOutput()
        response_body << parsed_output
      end
    elsif !@task.analysis.blank? # module task
      @analysis = @task.analysis
      @task_output = create_task_output(result['message'])
      parsed_output = processTaskOutput()
      response_body << parsed_output
    else
      @response_body = []
      result['message']['tasks'].each do |mrs|
        @analysis = Analysis.find_by(mid:mrs['module_id'])
        @task_output = create_task_output(mrs)
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
      is_pipeline = params[:is_pipeline]
      if !params[:mid].blank?
        @analysis = Analysis.find_by mid:params[:mid]
      else
        @pipeline = AnalysisPipeline.find_by pid:params[:pid]
      end

      # submit task

      result_hash = {status:"success", 
        message:{code:true, data:{msg:"Task submitted.", task_id:237}}}
      result = JSON.parse(result_hash.to_json)
      if result['message']['code']
        result_json[:code] = true
        @task  = @user.tasks.new
        @task.status = 'submitted'
        @task.tid = result['message']['data']['task_id']
        if is_pipeline
          @task.analysis_pipeline = @pipeline
          @task.analysis = nil
        else
          @task.analysis = @analysis
          @task.analysis_pipeline = nil
        end
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
      app_id = params[:mid]
      app_inputs = params[:inputs]
      app_params = params[:params]
      datasets_selected = params[:datasets]
      file_names = params[:file_names]
      is_pipeline = params[:is_pipeline]
      is_single = params[:is_single]
      is_demo = params[:is_demo]
      # @analysis = Analysis.find_by mid:params[:mid]
      if is_pipeline != 'true'
        @analysis = Analysis.find_by mid:params[:search_id]
      else
        @pipeline = AnalysisPipeline.find_by pid:params[:search_id]
      end
      inputs = Array.new
      params = Array.new



      if is_demo == "true"
        app_inputs&.each do |k,v|
          Rails.logger.debug "outputing demo files:"
          Rails.logger.debug k
          Rails.logger.debug v
          inputs.push({k => v})
        end

        app_params&.each do |k,v|
          Rails.logger.debug "outputing demo parameters:"
          Rails.logger.debug k
          Rails.logger.debug v
          params.push({k => v})
        end
      else

        # limit the number of samples for pipelines under multiple mode
        if is_pipeline == "true"
          total_samples = 0
          if !datasets_selected.blank?
            datasets_selected.each do |ds_name|
              total_samples += Project.find_by(project_name: ds_name).samples.count
            end
          end

          if !app_inputs.blank?
            app_inputs&.each do |input_id, uploaded_file|
              if file_names[input_id] == "Gene expression data"
                unless uploaded_file.nil? || uploaded_file == "" || uploaded_file == []
                  uploaded_files_array = Array(uploaded_file)
                  
    
                  uploaded_files_array.each do |up_file|
                    File.open(up_file.tempfile, 'r') do |tmpfile|
                      Rails.logger.info tmpfile
                      tmpfile.each do |line|
                        total_samples += line.split(",").count - 1
                        break
                      end
                    end
                  end
                end
              end
            end
          end
          
          if total_samples > 500
            result_json[:code] = false
            result_json[:data] = "The sample number is larger than 500."
            render json: result_json
            return
          end
        end

        # check the file type
        app_inputs&.each do |input_id, uploaded_file|
          Rails.logger.info file_names[input_id]
          if file_names[input_id] == "Gene expression data"
            unless uploaded_file.nil? || uploaded_file == "" || uploaded_file == []
              uploaded_files_array = Array(uploaded_file)
              uploaded_files_array.each do |up_file|
                File.open(up_file.tempfile, 'r') do |tmpfile|
                  Rails.logger.info tmpfile
                  tmpfile.each do |line|
                    if !(line.split(",").include?("GeneSymbol") || line.split(",").include?("\"GeneSymbol\"") )
                      result_json[:code] = false
                      result_json[:data] = "There is no 'GeneSymbol' column in your gene expression file"
                      render json: result_json
                      return
                    end
                    break
                  end
                end
              end

            end   
          elsif file_names[input_id] == "Clinical data"
            unless uploaded_file.nil? || uploaded_file == "" || uploaded_file == []
              uploaded_files_array = Array(uploaded_file)
              uploaded_files_array.each do |up_file|
                File.open(up_file.tempfile, 'r') do |tmpfile|
                  Rails.logger.info tmpfile
                  tmpfile.each do |line|
                    if !(line.split(",").include?("sample_name") || line.split(",").include?("\"sample_name\"") )
                      result_json[:code] = false
                      result_json[:data] = "There is no 'sample_name' column in your clinical file."
                      render json: result_json
                      return
                    end
                    break
                  end
                end
              end

            end    
          end
        end


        Rails.logger.debug "coming here"
        


        combine_inputs_array = {}

        Rails.logger.error app_inputs.class
        Rails.logger.error file_names

        file_names_revert = {}

        file_names.keys.each do |input_id|
          combine_inputs_array[input_id] = []
          file_names_revert[file_names[input_id]] = input_id
        end
        
        Rails.logger.debug "Sucess here - 110"
        Rails.logger.debug "dataset list is blank?: "
        Rails.logger.debug datasets_selected.blank?

        
        if !datasets_selected.blank?
          # idx_sum = 0
          # cur_length = 0
          datasets_selected.each do |ds_name|


            @dataset = Project.find_by(project_name: ds_name)

            if file_names_revert['Clinical data']
              combine_inputs_array[file_names_revert['Clinical data']].push("/data/clinical/Clinical_#{ds_name}.csv")
            end
            combine_inputs_array[file_names_revert['Gene expression data']].push("/data/rna/RNA_#{ds_name}.csv")

            # Rails.logger.debug "Sucess here - 1"
            # Rails.logger.debug ds_name

            # merged_files = @dataset.mergeFile(ds_name)
            # Rails.logger.debug merged_files.keys

            # Rails.logger.debug "Sucess here - 2"
            # cur_length = 0
        

            # file_names.keys.each do |input_id|
            #   cur_file_paths = []
            #   fname = file_names[input_id]
            #   Rails.logger.debug fname
            #   match_merged_files = merged_files[fname]
            #   Rails.logger.info "Outputing not existed database merged files: =======>"
            #   Rails.logger.info match_merged_files.class
            #   Rails.logger.info match_merged_files.blank?

            #   Rails.logger.info "Outputing the number of not existed database merged files: =======>"
            #   if !match_merged_files.blank?
            #     Rails.logger.debug match_merged_files.length
            #     cur_length = match_merged_files.length

            #     Rails.logger.info !match_merged_files.blank?
            #     match_merged_files.each_with_index do |m_file, idx|
            #       file_name = fname + "_" + (idx_sum + idx).to_s + ".csv"
            #       Rails.logger.debug file_name
            #       file = File.new(file_name, 'w')
            #       file.write(m_file)
            #       Rails.logger.debug "make files"
            #       uploader = JobInputUploader.new(giveFilePrefix())
            
            #       uploader.store!(file)
            #       Rails.logger.debug "make files success"

            #       Rails.logger.debug "upload files" + uploader.filename

            #       cur_file_paths.push('/data/' + uploader.filename)
            #       file.close
            #     end
            #     combine_inputs_array[input_id] += cur_file_paths
            #   end
            # end

            # Rails.logger.debug "Sucess here - 3"
            # idx_sum += cur_length

          end
        end

        Rails.logger.debug "app is blank?: "
        Rails.logger.debug datasets_selected.blank?

        if !app_inputs.blank?
          app_inputs&.each do |input_id, uploaded_file|
            
        
            # Rails.logger.debug datasets_selected
            unless uploaded_file.nil? || uploaded_file == "" || uploaded_file == []
              uploaded_files_array = Array(uploaded_file)
              Rails.logger.debug "Sucess here - 100"
              Rails.logger.debug uploaded_files_array

              uploaded_files_array.each do |up_file|
                uploader = JobInputUploader.new(giveFilePrefix())
                uploader.store!(up_file)
                combine_inputs_array[input_id].push('/data/' + uploader.filename)
              end
            end
          end
        end
        Rails.logger.debug "Sucess here - 4"


        if is_single == "true"
          file_names.keys.each do |input_id|
            combine_inputs_array[input_id] = combine_inputs_array[input_id][0, 1]
          end
        end

        file_names.keys.each do |input_id|
          inputs.push({
            # k => '/data/' + v.original_filename,
            input_id => combine_inputs_array[input_id].join(',')
          })
        end

        app_params&.each do |p|
          p.each do |k, v|
            params.push({
              k => v,
            })
          end
        end
      end

      Rails.logger.debug "===========>"
      Rails.logger.debug "===========>"
      Rails.logger.debug "This is the informtaion of final formatted and submitted files and parameters:"

      Rails.logger.info(inputs)
      Rails.logger.info(params)
      
      # submit task
      client = LocalApi::Client.new
      if is_pipeline == "true"
        result = client.run_pipeline(UID, PROJECT_ID, app_id.to_i, inputs, params)
      else
        result = client.run_module(UID, PROJECT_ID, app_id.to_i, inputs, params)
      end
      # Rails.logger.info(result['message'])
      Rails.logger.debug "===========>"
      Rails.logger.info(result)
      if result['message']['code']
        result_json[:code] = true
        @task  = @user.tasks.new
        if is_pipeline == 'true'
          @task.analysis_pipeline = @pipeline
          @task.analysis = nil
        else
          @task.analysis = @analysis
          @task.analysis_pipeline = nil
        end
        @task.status = 'submitted'
        @task.tid = result['message']['data']['task_id']
        @task.run_id = app_id.to_i
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
      result_json[:data] = e.message + "\nSomething wrong with your inputs."
    end
    render json: result_json
  end

  def query_deepomics
    begin
      client = LocalApi::Client.new
      result = client.task_info(UID, params[:id].to_i, params[:type])
      render json: result
      return
    end
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
        Rails.logger.info "Getting task details returned msg"
        Rails.logger.info result
        if task.analysis_id.blank? and result['status'] == 'success' and result['message']['code'] == true
            Rails.logger.debug "Fetched task details information for pipelines:"
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

  def query_app_task
    result_json = {
      tid: nil,
      type: nil,
      body: nil,
      code: false,
      data: ''
    }
    begin
      @task = nil
      if params[:is_demo] == "true"
        @task = Task.find_by! id:params[:job_id] #, is_demo: true
      else 
        @task =Task.find_by! id:params[:job_id], user_id:session[:user_id]
      end

      if !@task.analysis.blank?
        result_json[:type] = "app"
      else
        result_json[:type] = "pipeline"
      end

      result_json[:tid] = @task.tid
      
      if TaskOutput.where(task_id:@task.id).exists?
        response_body = []
        task_outputs = TaskOutput.where(task_id:@task.id)
        task_outputs.each do |otp|
          @task_output = otp
          @analysis = otp.analysis
          parsed_output = processTaskOutput()
          response_body << parsed_output
        end
        render json: {"body": response_body, "tid": result_json[:tid], "type": result_json[:type]}
        return
      end
      # query task
      client = LocalApi::Client.new
      result = ''
      if !@task.analysis.blank?
        result = client.task_info(UID, @task.tid, 'app')
      else
        result = client.task_info(UID, @task.tid, 'pipeline')
      end
      Rails.logger.info(result)

      if @task.status == 'submitted'
        @task.status = result['message']['status'] if !result['message']['status'].blank?
        @task.save!
      end

      if result['status'] == 'success'
        response_body = []
        @task_output = {}
        
        if result['message']['status'] == 'finished'
          if result['message']['type'] == "module" # module task
            Rails.logger.info "Query app task: this is an app task"
            result_json[:type] = "app"
            @analysis = @task.analysis
            @task_output = create_task_output(result['message'])
            parsed_output = processTaskOutput()
            response_body << parsed_output
          else
            Rails.logger.info "Query app task: this is an pipeline task"
            result_json[:type] = "pipeline"
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
        render json: {"body": response_body, "tid": result_json[:tid], "type": result_json[:type]}
        return
      else
        result_json[:data] = result['message']
      end
     
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def query_demo_task # query a demo task
    result_json = {
      code: false,
      data: ''
    }
    @task = Task.find_by! id:params[:job_id]
    response_body = []
    task_outputs = TaskOutput.where(task_id:@task.id)
    task_outputs.each do |otp|
      @task_output = otp
      @analysis = otp.analysis
      parsed_output = processTaskOutput()
      response_body << parsed_output
    end
    render json: response_body
  end

  def remove_task
    @task = Task.find params[:job_id]
    
    if !@analysis_user_datum.blank?
      @analysis_user_datum = AnalysisUserDatum.find_by analysis_id: @task.analysis.id, user_id: session[:user_id]
      @analysis_user_datum.task_output = nil
      @analysis_user_datum.use_demo_file = true
      @analysis_user_datum.save!
    end
    @task.destroy!
    render json:{code:true}
  end

  private

  def process_module_result
  
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
    files_to_do = [];

    mrs['outputs'].each do |ofile|
      ofile = ofile['files'][0]
      files_to_do.push(ofile)
    end

    # files_to_do = mrs['outputs'][0]['files']
    logger.debug "===========================>Find task output information!"
    logger.info files_to_do

    # common_path = ""
    
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
              # common_path = of1['path']
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
              # common_path = of1['path']
            end
          end
        end
      end
    end

    # if Dir[File.join(Rails.root, "/data/outputs", common_path, "*full.csv")].length > 0
    #   full_file_path = Dir[File.join(Rails.root, "/data/outputs", common_path, "*full.csv")][0]
    #   file_paths["RNAData"] = {id: 0, 
    #     url: full_file_path[full_file_path.index("/data/outputs/")..-1],
    #     is_demo: true}
    # end

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
    @matched_visualizers = @analysis.visualizers
    @matched_jsnames = []

    @matched_visualizers.each do |mvis|
      @matched_jsnames.push([mvis.name, mvis.js_module_name])
    end

    Rails.logger.debug("check visualizers of this analysis:")
    Rails.logger.debug @matched_jsnames

    parsed_output = {}
    parsed_output['module_names'] = @matched_jsnames
    parsed_output['name'] = @analysis.name
    parsed_output['analysis_id'] = @analysis.id
    parsed_output['required_data'] = @analysis.files_info.keys
    return parsed_output
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

  private
  def giveFilePrefix()
    uid = session[:user_id]
    time = Time.now
    time_str = time.strftime("%Y_%m_%d")       
    time_str += ("_" + time.strftime("%k_%M")) 
    time_str = time_str.gsub(' ','')
    file_prefix = "i_#{uid}_#{time_str}_"
    return file_prefix
  end
end
