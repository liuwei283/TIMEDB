class OrgansController < ApplicationController
    http_basic_authenticate_with name: "admin", password: "Lovelace", only: [:new, :create, :edit, :update, :destroy]
    $seq_dir = "#{Rails.root}/app/data/seq/"
    $inf_dir = "#{Rails.root}/app/data/inf_files/"
    $tmp_dir = "#{Rails.root}/app/data/tmp/"

    def index
        @vis = ['id', 'primary_site', 'num_of_projects', 'project_list', 'num_of_samples', 'data_type', 'program']
        @organs = Organ.order(:primary_site)
        @attrs = Organ.column_names
        @invis = []
        @attrs.each_with_index do |attr, index|
            if !@vis.include?(attr) && attr != 'cover_image'
                @invis.push(index+1)
            end
        end
        gon.push invis: @invis
        respond_to do |format|
            format.html
            format.csv { send_data @organs.to_csv }
            format.json { render json: OrganDatatable.new(view_context) }
        end
    end

    #show details of the primary site and will be considered to transformed to popover format
    def show
        @vis = ['id', 'project_name', 'primary_site', 'num_of_samples', 'num_of_oberserved_genes', 'major_related_publications',"original_link"]
        @user = User.find(session[:user_id])
        @organ = Organ.find(params[:id])
        @attrs = Organ.column_names
        @project_attrs = Project.column_names
        @projects = @organ.projects
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
            format.csv { send_data @organ.projects.to_csv }
            format.json { render json: OrganProjectDatatable.new(view_context, @organ) }
        end
    end

  
    def edit
        @attrs = Organ.column_names
        @organ = Organ.find(params[:id])
        @project_attrs = Project.column_names
    end
  
    def destroy
        @organ = Organ.find(params[:id])
        @organ.destroy
        redirect_to "/admin"
    end

    def import
        Organ.import(params[:file])
        redirect_to '/admin', notice: "Organs imported."
    end

    def export_selected
        @organs = Organ.order(:primary_site)
        send_data @organs.selected_to_csv(params[:selected_ids])
    end

    def new
        @organ = Organ.new
        @attrs = Organ.column_names
    end
  
    def create        
        @organ = Organ.new(organ_params)
        if @organ.save
            @organ.update_attribute(:num_of_projects, @organ.projects.count)
            redirect_to @organ
        else
            render 'new'
        end
    end

    def update
        @organ = Organ.find(params[:id])
        
        if @organ.update(organ_params)
            redirect_to @organ
        else
            render 'edit'
        end
    end
  
    private 
        def organ_params
            params.require(:organ).permit(:primary_site, :project_list, :data_type, :program, :cover_image)
        end
  
end
