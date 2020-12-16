class AnalysisController < ApplicationController
    before_action :instantiate_sidebar
    def index
        @analyses = Analysis.all
    end

    def show 
        @analysis = Analysis.find(params[:id])
        files_info = @analysis.files_info
        if AnalysisUserDatum.where("visitor_id = ? AND analysis_id = ?",
                session[:visitorid], params[:id]).blank?
            @analysisUserDatum = @analysis.analysis_user_data.new
            default_chosen = {}.tap { |x|
                files_info.each do |dataType, info|
                    next unless !VizDataSource.find_by(data_type:dataType).optional
                    x[dataType] = nil
                end
            } 
            @analysisUserDatum.chosen =  default_chosen
            @analysisUserDatum.visitor = Visitor.find(session[:visitorid])
            @analysisUserDatum.save!
        end


        gon.push module_name: @analysis.visualizer.js_module_name,
                 analysis_name: @analysis.name,
                 required_data: files_info.keys, 
                 urls: {
                    create_file: api_analysis_create_files_path(@analysis),
                    all_files: api_analysis_all_files_path(@analysis),
                    chosen_files: api_analysis_chosen_files_path(@analysis),
                    chosen_file_paths: api_analysis_chosen_file_paths_path(@analysis),
                 }

    end

    def instantiate_sidebar 
        @analysis_categories = AnalysisCategory.all
        if session[:visitorid].blank?
            visitor = Visitor.create
            session[:visitorid] = visitor.id
        end
    end
end
