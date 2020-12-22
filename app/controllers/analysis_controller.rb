class AnalysisController < ApplicationController
    before_action :instantiate_sidebar
    def index
        @analyses = Analysis.all
    end

    def show 
        @analysis = Analysis.find(params[:id])
        files_info = @analysis.files_info
        if AnalysisUserDatum.where("user_id = ? AND analysis_id = ?",
                session[:user_id], params[:id]).blank?
            @analysisUserDatum = AnalysisUserDatum.createDefaultDatum params[:id], session[:user_id]
        end

        gon.push module_name: @analysis.visualizer.js_module_name,
                 analysis_name: @analysis.name,
                 required_data: files_info.keys, 
                 urls: {
                    use_demo: api_analysis_use_demo_path(@analysis),
                    create_file: api_analysis_create_files_path(@analysis),
                    all_files: api_analysis_all_files_path(@analysis),
                    chosen_files: api_analysis_chosen_files_path(@analysis),
                    chosen_file_paths: api_analysis_chosen_file_paths_path(@analysis),
                    batch_delete_files: api_analysis_batch_delete_files_path(@analysis),
                 }

    end

    def instantiate_sidebar 
        @analysis_categories = AnalysisCategory.all
        if session[:user_id].blank? || !User.exists?(session[:user_id])
            user = User.create
            session[:user_id] = user.id
           
        end
    end
end
