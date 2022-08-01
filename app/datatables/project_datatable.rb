class ProjectDatatable < ApplicationDatatable
    private
  
    def data
      projects.map do |project|
        [].tap do |column|
          column << ""
          (Project.column_names - ['cancer_id', 'publications_link', 'original_link']).each do |attr|
            if attr != 'id'
              if attr == 'project_name'
                column << link_to("#{project[attr]}", project.original_link)
              elsif attr == 'major_related_publications'
                column << link_to("#{project[attr]}", project.publications_link)
              else
                column << "<div class='table_cell'> #{project[attr]} </div>"
              end
            else
              column << project[attr]
            end
          end
          column << "<button class='btn btn-1'> #{link_to('Details', project)} </button>"
          # column << link_to('Show', overview_project_path(project))
        end
      end
    end
  
    def count
      Project.count
    end
  
    def total_entries
      projects.total_count
      # will_paginate
      # users.total_entries
    end
  
    def projects
      @projects ||= fetch_projects
    end
  
    def fetch_projects
      search_string = []
      Project.column_names.each do |attr|
        if Project.columns_hash[attr].type != :string
          search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
        else
          search_string << "\"#{attr}\" like :search"
        end
      end
      # search_col =['project_name', 'project_name', 'experiment_type']
      # search_col.each do |term|
      #   search_string << "#{term} like :search"
      # end
  
      # will_paginate
      # users = User.page(page).per_page(per_page)
      Rails.logger.info sort_column
      Rails.logger.info "0000"
      if params[:order]['0'][:column].to_i == 0
        #projects = Project.order(project_name=="TCGA_ACC")
        projects = Project.order("project_name not LIKE '%TCGA_%'").order(:id)
        # Rails.logger.info fo_projects.class
        # Rails.logger.info "8888888888888"
        # so_projects = Project.where("project_name not like ?", "%TCGA_ACC%")
        # projects = fo_projects.or(so_projects)
        # Table.find(:all, :conditions => ['keywords LIKE ?', '%crescent%'])
      else

        projects = Project.order("#{sort_column} #{sort_direction}")
      end
      
      projects = projects.page(page).per(per_page)
      if params[:search][:value] != ""
        projects = projects.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
      else
        projects = projects.page(page).per(per_page)
      end
      #projects = projects.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
    end
  
    def columns
      Project.column_names
      # %w(first_name last_name email phone_number)
    end
  end