class SubmitController < ApplicationController
  UID = 39
  PROJECT_ID = 259
  TASK_ID = 1371
  info = {"status"=>"success", "message"=>{"status"=>"finished", "inputs"=>[{"id"=>945, "name"=>"MetaPhlan results", "desc"=>"MetaPhlan results", "files"=>[{"name"=>"PH_sample_bacteria.xls", "path"=>"/data"}]}], "outputs"=>[{"id"=>766, "name"=>"PCoA, Shannon diversity, Top10 compositions and Comparison", "desc"=>"PCoA, Shannon diversity, Top10 compositions and Comparison", "files"=>[{"name"=>"pcoa.pdf", "path"=>"/project/TestProject/task_20200809184940"}, {"name"=>"Shannon.pdf", "path"=>"/project/TestProject/task_20200809184940"}, {"name"=>"histogram.pdf", "path"=>"/project/TestProject/task_20200809184940"}, {"name"=>"Top10_boxplot.pdf", "path"=>"/project/TestProject/task_20200809184940"}]}], "params"=>[{"id"=>1711, "name"=>"Target region", "prefix"=>"-r", "default"=>"CHN", "desc"=>"Select the samples from the target region in this oral microbiome database, e.g. CHN, JPN, PH or USA.", "value"=>"CHN"}]}}
  def index
    id = params[:id]
    gon.push id: id
  end

  def query
  end

  def submit_app_task
    result_json = {
      code: false,
      data: ''
    }
    begin
      app_id = params[:app_id]
      app_inputs = params[:inputs]
      app_params = params[:params]
      inputs = Array.new
      params = Array.new

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
      result = client.run_module(UID, PROJECT_ID, app_id.to_i, inputs, params)
      Rails.logger.info(result)
      if result['message']['code']
        result_json[:code] = true
        result_json[:data] = {
          'msg': result['message']['data']['msg'],
          'task_id': encode(result['message']['data']['task_id'])
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


  def encode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.encode(id)
  end
  def decode(id)
    hashids = Hashids.new("this is my salt", 16)
    hashids.decode(id)[0]
  end
end
