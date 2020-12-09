class VizFilesController < ApplicationController
  before_action :instantiate_models

    def all_files
        data = []
        files = @analysis.viz_source_files
        files.each do |file|
            parsed_file = file.as_json
            parsed_file['files'] = file.viz_data_objects
            data << parsed_file
        end
        render json: data
    end

    def chosen_file_paths
        chosen = {}
        @viz_source_files = @analysis.viz_source_files

        if @analysis_user_datum.use_demo_file
            render json: {}.tap { |x|
                @viz_source_files.each do |vsf|
                    x[vsf.data_type] = {id: 0, 
                        url: "/data/demo/#{@analysis.demo_files[vsf.data_type]}", is_demo: true}
                end
            }
            return
        end
              
        @viz_source_files.each do |vsf|
            chosen_file_id = @analysis_user_datum.chosen[vsf.data_type]
            if !chosen_file_id.blank?
                chosen[vsf.data_type] = {
                    id: chosen_file_id,
                    url: VizDataObject.find(chosen_file_id).file.url
                }
            else
                chosen[vsf.data_type] = nil
            end
        end
        
        
        render json: chosen
    end

    def get_chosen_files
        render json: {
                use_demo: @analysis_user_datum.use_demo_file,
                chosen: @analysis_user_datum.chosen
            } 
        
    end

    def update_chosen_files
        data = []
        chosen = @analysis_user_datum.chosen
        @analysis.viz_source_files.each do |vsf|
            next unless !params["_f_#{vsf.data_type}"].blank?
            vdo = VizDataObject.find(params["_f_#{vsf.data_type}"])
            data << vdo
            chosen[vsf.data_type] = vdo.id
        end
        @analysis_user_datum.chosen = chosen
        @analysis_user_datum.save!
        render json: { status: 'ok', files: data }
    end

    def create_files
        return head 422 unless request.xhr?
        
        result = {}
        chosen = @analysis_user_datum.chosen
        params.each do |key, file|
            next unless key.start_with? '_f_'
            dataType = key.delete_prefix('_f_')
            vdo = @visitor.viz_data_objects.new
            vdo.file = file
            vsf = @analysis.viz_source_files.find_by(data_type:dataType)
            vdo.viz_source_file = vsf
            vdo.file = file
            vdo.file_name = params["_fn_#{dataType}"]
            vdo.save!
            result[dataType] = { id: vdo.id }
            chosen[dataType] = vdo.id
        end
        @analysis_user_datum.chosen = chosen
        @analysis_user_datum.save!

        render json: { status: 'ok', files: result }
    end

    def demo_files
        data = {}
        if @analysis_user_datum.use_demo_file
            data = @analysis.demo_files
        end
        render json: data
    end


    def instantiate_models
        @analysis = Analysis.find(params[:id])
        @visitor = Visitor.find(session[:visitorid])
        @analysis_user_datum = AnalysisUserDatum.find_by analysis:@analysis, visitor: @visitor
    end
end
