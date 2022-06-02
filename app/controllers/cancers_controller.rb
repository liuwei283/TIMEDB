class CancersController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/public/data/sample_plot/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"

        
    def index
        @vis = ['id', 'cancer_name', 'cancer_type', 'data_source', 'number_of_related_projects', 'number_of_samples', 'sub_cancer', 'primary_site']
        @cancers = Cancer.order(:cancer_name)
        @attrs = Cancer.column_names
        @invis = []
        @attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        respond_to do |format|
            format.html
            format.csv { send_data @cancers.to_csv }
            format.json { render json: CancerDatatable.new(view_context) }
        end
    end

    
    def show
        @vis = ['id', 'project_name', 'cancer_name', 'num_of_samples', 'preprocessed', 'database', "original_description", "major_related_publications"]
        @short_attrs = [['cancer_name', 'cancer_type', 'data_source', 'number_of_related_projects'], ['number_of_samples', 'sub_cancer', 'primary_site']]

        @user = User.find(session[:user_id])
        @cancer = Cancer.find(params[:id])
        @attrs = Cancer.column_names
        @project_attrs = Project.column_names
        @projects = @cancer.projects
        @invis = []
        @project_attrs.each_with_index do |attr, index|
            if !@vis.include?(attr)
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        
        id = session[:user_id]
        @user = User.find(id) 
        @datasets = @user.datasets
        respond_to do |format|
            format.html
            format.csv { send_data @cancer.projects.to_csv }
            format.json { render json: CancerProjectDatatable.new(view_context, @cancer) }
        end
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
