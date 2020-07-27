class SubmitController < ApplicationController
  def index
    id = params[:id]
    # if id == 1
    #   @analysis = 'Taxonomic compositions'
    # elsif id == 2
    #   @analysis = 'Functional Categories'
    # else
    #   @analysis = 'Antibiotic Abilities'
    # end
    gon.push id: id
  end

  def query
  end

  def submit_app_task
    result_json = {
      code: false,
      data: ''
    }
    app_inputs = params[:inputs]
    app_inputs&.each do |k, v|
      # print(k, v.original_filename)
      uploader = JobInputUploader.new
      uploader.store!(v)
    end
    render json: result_json
  end
end
