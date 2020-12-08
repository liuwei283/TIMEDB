class SubmitController < ApplicationController
  UID = 45
  PROJECT_ID = 289
  $user_stor_dir = "#{Rails.root}/app/data/user"
  
  def index
    id = params[:id]
    gon.push id: id
    uid = cookies.encrypted[:user]
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
  end

  def submit_app_task
    uid = cookies.encrypted[:user]
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
      inputs = Array.new
      params = Array.new

      # store selected file to user's data folder
      app_selected&.each do |k, v|
        file_name = v.split("/")[1]
        ds_name = v.split("/")[0]
        file_path = File.join(user_dir, ds_name, file_name)
        file = File.open file_path
        uploader = JobInputUploader.new
        Rails.logger.info("=======>#{uploader}")
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
        inputs.push({
          k => '/data/' + v.original_filename,
        })
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
      Rails.logger.debug("========================>")
      Rails.logger.info(inputs)
      Rails.logger.info(params)
      result = client.run_module(UID, PROJECT_ID, app_id.to_i, inputs, params)
      Rails.logger.info(result['message'])
      if result['message']['code']
        result_json[:code] = true
        result_json[:data] = {
          'msg': result['message']['data']['msg'],
          'task_id': encode(result['message']['data']['task_id'])
        }
        if @user.task_ids == ""
          @user.task_ids = result_json[:data] ['task_id']
        else
          @user.task_ids += ("," + result_json[:data] ['task_id'])
        end

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
          if result['message']['status'] = 'finished'
            result_json[:data] = {
              'msg': result['message'],
              'task_id': params[:job_id]
            }
          elsif result['message']['status'] = 'failed'
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
