class SubmitController < ApplicationController
  UID = 45
  PROJECT_ID = 289
  $user_stor_dir = "#{Rails.root}/data/user"
  
  def index
    id = params[:id]
    gon.push id: id
    uid = session[:user_id]
    @user = User.find(uid)
    user_dir = File.join($user_stor_dir, uid.to_s)
    @datasets = @user.datasets
    data = {}
    @datasets.each do |ds|
      ds_name = ds.name
      ds_dir = File.join(user_dir, ds_name)
      file_list = Dir.entries(ds_dir)[2..-1]
      data[ds_name] = file_list
    end
    gon.push select_box_option: data

  end

  def query
    id = params[:id]
    uid = session[:user_id]
    @user = User.find(uid)
    user_dir = File.join($user_stor_dir, @user.id.to_s)
    if @user.task_ids
      @task_list = @user.task_ids.split(',')
    else
      @task_list = []
    end
    gon.push tasks: @task_list
  end

  def query_app_task_dummy
    return_json_hash = {
      status: 'success',
      message: {
        status: "finished",
        outputs: [
          {
            id: 712,
            name: "Pathway Enrichment",
            files: [
              {
                name: "species_ko.cor.xls",
                path: "/Pathway_enrichment"
              },
              {
                name: "species.anno.xls",
                path: "/Pathway_enrichment"
              },
              {
                name: "exported_tree.newick",
                path: "/Pathway_enrichment"
              }
            ]
          },
          {
            id: 711,
            name: "Drug Use",
            desc: "Drug Use Analysis",
            files: [
              {
                name: "T1_sample.xls",
                path: "/drug_used"
              },
              {
                name: "T2_sample.xls",
                path: "/drug_used"
              },
              {
                name: "T3_sample.xls",
                path: "/drug_used"
              }
            ]
          }
        ]
      }
    }
    result_json = {
      code: true,
      data: Array.new
    }
    return_json = JSON.parse(return_json_hash.to_json)
    parsed_outputs = []
    return_json['message']['outputs'].each do |otp|
      
      analysis = Analysis.find_by(name: otp['name'])
      
      source_files = {}
      parsed_output = analysis.as_json
      viz_source_files = analysis.viz_source_files.as_json
      
      parsed_output['files'] = {}
      viz_source_files.each do |vsf|
        parsed_vsf = {}
        if vsf['allow_multiple']
          
          otp['files'].each do |f|
            if vsf['output_file_name'].split.include? f['name']
              if parsed_output['files'][vsf['data_type']]
                parsed_output['files'][vsf['data_type']][:path].push File.join(f['path'], f['name'])
              else
                parsed_vsf[:path] = [File.join(f['path'], f['name'])]
                parsed_output['files'][vsf['data_type']] = parsed_vsf
              end
            end
          end
        else
          otp['files'].each do |f|
            if vsf['output_file_name'] === f['name']
              parsed_vsf[:path] =  File.join f['path'], f['name']
              parsed_output['files'][vsf['data_type']] = parsed_vsf
            end
          end
        end
      end
      
      
      result_json[:data].push(parsed_output)      
    end
    Rails.logger.debug("=========>#{result_json}")
    
    render json: result_json
  end

  def submit_app_task
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

      inputs = Array.new
      params = Array.new

      # store selected file to user's data folder
      app_selected&.each do |k, v|
        file_name = v.split("/")[1]
        ds_name = v.split("/")[0]
        file_path = File.join(user_dir, ds_name, file_name)
        file = File.open file_path
        uploader = JobInputUploader.new
        uploader.store!(file)
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
      Rails.logger.info(result['message'])
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
      job_id = decode(params[:job_id])
      Rails.logger.info(job_id)
      if job_id
        # submit task
        client = LocalApi::Client.new
        result = client.task_info(UID, job_id.to_i, 'app')
        Rails.logger.info(result)
        # result = {"status"=>"success", "message"=>{"status"=>"finished", "inputs"=>[{"id"=>946, "name"=>"MetaPhlan results", "desc"=>"MetaPhlan results", "files"=>[{"name"=>"CRC_Abd_table.txt", "path"=>"/data"}]}], "outputs"=>[{"id"=>779, "name"=>"PCoA analysis", "desc"=>"Bray-Curtis distances among the uploaded sample(s) and the samples in the database will be calculated, and then PCoA analysis will be performed. ", "files"=>[{"name"=>"pcoa.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}, {"id"=>778, "name"=>"Shannon diversity", "desc"=>"The Shannon diversity is calculated for the uploaded sample(s), and be compared with the samples in the databases. ", "files"=>[{"name"=>"Shannon.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}, {"id"=>777, "name"=>"Taxonomical annoatation results", "desc"=>"Top 10 genus and species are selected from the samples, and the taxonomic compositions of the uploaded sample(s).", "files"=>[{"name"=>"histogram.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}, {"id"=>776, "name"=>"Comparison of top 10 genus and species", "desc"=>"The relative abundances of top10 genus and species are compared between the uploaded sample(s) and the data from the database.", "files"=>[{"name"=>"Top10_boxplot.pdf", "path"=>"/project/TestProject/task_20200814114313"}]}], "params"=>[{"id"=>1712, "name"=>"Target region", "prefix"=>"-r", "default"=>"CHN", "desc"=>"Select the samples from the target region in this oral microbiome database, e.g. CHN, JPN, PH or USA.", "value"=>"CHN"}]}}
        if result['status'] == 'success'
          result_json[:code] = true
          if result['message']['status'] == 'finished'
            result_json[:data] = {
              'msg': result['message'],
              'task_id': params[:job_id]
            }
          elsif result['message']['status'] == 'failed'
            result_json[:data] = {
              'msg': 'Job failed! ' + result['message'],
              'task_id': params[:job_id]
            }
          else
            result_json[:data] = {
              'msg': 'Your Job is still running.',
              'task_id': params[:job_id]
            }
          end
        else
          result_json[:data] = {
            'msg': result['messgae'],
            'task_id': params[:job_id]
          }
        end
      else
        result_json[:code] = true
        result_json[:data] = {
          'msg': 'Job not found!',
          'task_id': params[:job_id]
        }
      end
    rescue StandardError => e
      result_json[:code] = false
      result_json[:data] = e.message
    end
    render json: result_json
  end

  def encode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.encode(id)
  end
  def decode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.decode(id)[0]
  end
end
