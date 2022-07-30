class CancersController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/public/data/sample_plot/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"

        
    def index
        #@vis = ['id', 'cancer_name', 'cancer_type', 'data_source', 'number_of_related_projects', 'number_of_samples', 'sub_cancer', 'primary_site']
        @cancers = Cancer.order(:cancer_name)
        @attrs = Cancer.column_names - ['created_at', 'updated_at']
        #@invis = []
        # @attrs.each_with_index do |attr, index|
        #     if !@vis.include?(attr)
        #         @invis.push(index+1)
        #     end
        # end
        # gon.push invis: @invis
        respond_to do |format|
            format.html
            format.csv { send_data @cancers.to_csv }
            format.json { render json: CancerDatatable.new(view_context) }
        end


         #data processing for table filtering
         @sp_col_index = [4, 5, 6, 7]
         gon.push sp_col_index: @sp_col_index
         range_cols = [["number_of_related_projects", 4], ["number_of_samples", 5]]
         @col_ranges = []
         for col in range_cols
             @col_ranges.push({n: col[1], min: Cancer.order("cancer_name").map{|cac| cac[col[0]].to_i}.min(), max: Cancer.all.map{|cac| cac[col[0]].to_i}.max()})
         end
 
         puts "Printing fetched column ranges"
         puts @col_ranges
 
         gon.push col_ranges: @col_ranges
         
    end

    
    def show
        # @vis = ['id', 'project_name', 'cancer_name', 'num_of_samples', 'preprocessed', 'database', "original_description", "major_related_publications"]
        @short_attrs = [['cancer_name', 'cancer_type', 'data_source', 'number_of_related_projects'], ['number_of_samples', 'sub_cancer', 'primary_site']]

        @user = User.find(session[:user_id])
        @cancer = Cancer.find(params[:id])
        @attrs = Cancer.column_names
        @project_attrs = Project.column_names - ["cancer_id", "created_at", "updated_at"]
        @projects = @cancer.projects.order("project_name not LIKE '%TCGA_%'").order(:id)
        # @invis = []
        # @project_attrs.each_with_index do |attr, index|
        #     if !@vis.include?(attr)
        #         @invis.push(index+1)
        #     end
        # end
        # gon.push invis: @invis
        
        id = session[:user_id]
        @user = User.find(id) 
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @cancer.projects.to_csv }
            format.json { render json: CancerProjectDatatable.new(view_context, @cancer) }
        end


        @sp_col_index = [3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16]
        gon.push sp_col_index: @sp_col_index
        range_cols = [["num_of_samples", 3], ["num_of_observed_genes", 7]]
        @col_ranges = []
        for col in range_cols
            @col_ranges.push({n: col[1], min: @projects.order("project_name").map{|pjt| pjt[col[0]].to_i}.min(), max: @projects.map{|pjt| pjt[col[0]].to_i}.max(),})
        end

        puts "Printing fetched column ranges"
        puts @col_ranges

        gon.push col_ranges: @col_ranges
    end

  
    def edit
        @attrs = Cancer.column_names
        @cancer = Cancer.find(params[:id])
        @project_attrs = Project.column_names
    end
  
    def destroy
        @cancer = Cancer.find(params[:id])
        @cancer.destroy
        redirect_to "/admin"
    end

    def import
        Cancer.import(params[:file])
        redirect_to '/admin', notice: "Cancers imported."
    end

    def export_selected
        @cancers = Cancer.order(:cancer_name)
        send_data @cancers.selected_to_csv(params[:selected_ids])
    end

    def new
        @cancer = Cancer.new
        @attrs = Cancer.column_names
    end
  
    def create        
        @cancer = Cancer.new(cancer_params)
        if @cancer.save
            @cancer.update_attribute(:number_of_related_projects, @cancer.projects.count)
            redirect_to @cancer
        else
            render 'new'
        end
    end

    def update
        @cancer = Cancer.find(params[:id])
        
        if @cancer.update(cancer_params)
            redirect_to @cancer
        else
            render 'edit'
        end
    end
  
    private 
        def cancer_params
            params.require(:cancer).permit(:id, :cancer_name, :cancer_type, :data_source, :number_of_related_projects, :number_of_samples, :sub_cancer, :primary_site)
        end
  
end
